#include <furi.h>
#include <furi_hal.h>
#include <cli/cli.h>
#include <furi_hal_serial.h>
#include <toolbox/protocols/protocol_dict.h>
#include <lfrfid/protocols/lfrfid_protocols.h>
#include <lfrfid/lfrfid_worker.h>

#define TAG "RFID"

// Scanning data context
typedef struct {
    LFRFIDWorker* worker;
    ProtocolDict* dict;
    FuriEventFlag* event;
    ProtocolId protocol;
    bool card_found;
    uint32_t start_time;
    uint8_t* card_data;
    size_t card_data_size;
} RFIDScanContext;

static FuriHalSerialHandle* uart_handle;

// Callback when RFID card is read
static void rfid_read_callback(LFRFIDWorkerReadResult result, ProtocolId protocol, void* context) {
    RFIDScanContext* ctx = (RFIDScanContext*)context;
    if(result == LFRFIDWorkerReadDone) {
        // Sucessfully read a card
        ctx->card_found = true;
        ctx->protocol = protocol;
        furi_event_flag_set(ctx->event, 1 << LFRFIDWorkerReadDone); // Setup flag
    }
}

static void rfid_write_callback(LFRFIDWorkerWriteResult result, void* context) {
    (void)context;
    if(result == LFRFIDWorkerWriteOK) {
        FURI_LOG_I(TAG, "Successfully wrote data to the second card");
    } else {
        FURI_LOG_E(TAG, "Failed to write data to the second card");
    }
    
}
static void scan_second_card(RFIDScanContext* ctx) {
    FURI_LOG_I(TAG, "Starting scan for the second card (max 10s)");
    ctx->start_time = furi_get_tick();
    ctx->card_found = false;
    ctx->protocol = PROTOCOL_NO;

    while(((float)(furi_get_tick() - ctx->start_time)) / furi_kernel_get_tick_frequency() < 10.0f) {
        FURI_LOG_I(TAG, "Calling lfrfid_worker_read_start() for second card...");
        lfrfid_worker_read_start(ctx->worker, LFRFIDWorkerReadTypeAuto, rfid_read_callback, ctx);

        FURI_LOG_I(TAG, "Waiting for LFRFIDWorkerReadDone (1s)...");
        uint32_t flags = furi_event_flag_wait(
            ctx->event,
            1 << LFRFIDWorkerReadDone,
            FuriFlagWaitAny,
            1000
        );

        if(flags != (uint32_t)FuriFlagErrorTimeout) {
            if(FURI_BIT(flags, LFRFIDWorkerReadDone)) {
                FURI_LOG_I(TAG, "Second card detected successfully!");
                break;
            }
        } else {
            FURI_LOG_I(TAG, "No second card found, retry...");
            lfrfid_worker_stop(ctx->worker);
            furi_delay_ms(500);  // Wait before retry
        }
    }
}

int32_t serial_rfid_control_main(void) {
    FURI_LOG_I(TAG, "==== ENTER serial_rfid_control_main ====");

    // Initial UART
    FURI_LOG_I(TAG, "Acquiring UART handle...");
    uart_handle = furi_hal_serial_control_acquire(FuriHalSerialIdLpuart);
    furi_delay_ms(200);
    if(!uart_handle) {
        FURI_LOG_E(TAG, "Failed to init UART => return -1");
        return -1;
    }
    FURI_LOG_I(TAG, "Acquired UART OK => %p", (void*)uart_handle);
    furi_hal_serial_init(uart_handle, 115200);

    // Initial RFIDScanContext
    RFIDScanContext ctx = {0}; // Initial all fields to 0
    ctx.dict = protocol_dict_alloc(lfrfid_protocols, LFRFIDProtocolMax);
    ctx.worker = lfrfid_worker_alloc(ctx.dict);
    ctx.event = furi_event_flag_alloc();
    ctx.card_data = NULL;
    lfrfid_worker_start_thread(ctx.worker);

    // Scan the first card
    FURI_LOG_I(TAG, "Starting scan for the first card (max 10s)");
    ctx.start_time = furi_get_tick();
    ctx.card_found = false;
    ctx.protocol = PROTOCOL_NO;
    while(((float)(furi_get_tick() - ctx.start_time)) / furi_kernel_get_tick_frequency() < 10.0f) {
        lfrfid_worker_read_start(ctx.worker, LFRFIDWorkerReadTypeAuto, rfid_read_callback, &ctx);
        uint32_t flags = furi_event_flag_wait(ctx.event, 1 << LFRFIDWorkerReadDone, FuriFlagWaitAny, 1000);
        if(flags != (uint32_t)FuriFlagErrorTimeout) {
            if(FURI_BIT(flags, LFRFIDWorkerReadDone)) {
                FURI_LOG_I(TAG, "First card read successfully!");
                break;
            }
        } else {
            FURI_LOG_I(TAG, "No first card found, retry...");
            lfrfid_worker_stop(ctx.worker);
            furi_delay_ms(500);
        }
    }

    if(ctx.card_found && ctx.protocol != PROTOCOL_NO) {
        // Get data from the first card
        ctx.card_data_size = protocol_dict_get_data_size(ctx.dict, ctx.protocol);
        ctx.card_data = malloc(ctx.card_data_size);
        if(!ctx.card_data) {
            FURI_LOG_E(TAG, "Failed to allocate memory for RFID data!");
            goto cleanup;
        }
        protocol_dict_get_data(ctx.dict, ctx.protocol, ctx.card_data, ctx.card_data_size);

        // Print UID
        FURI_LOG_I(TAG, "RFID Card UID:");
        for(size_t i = 0; i < ctx.card_data_size; i++) {
            FURI_LOG_I(TAG, "%02X", ctx.card_data[i]);
        }

        // Send UID to UART
        char uart_buffer[64];
        snprintf(uart_buffer, sizeof(uart_buffer), "UID: ");
        for(size_t i = 0; i < ctx.card_data_size; i++) {
            snprintf(uart_buffer + strlen(uart_buffer),
                     sizeof(uart_buffer) - strlen(uart_buffer),
                     "%02X", ctx.card_data[i]);
        }
        FURI_LOG_I(TAG, "Sending via UART: %s", uart_buffer);
        furi_hal_serial_tx(uart_handle, (uint8_t*)uart_buffer, strlen(uart_buffer));

        // Wait 10s before scanning the second card
        FURI_LOG_I(TAG, "Waiting for 10 seconds before scanning the second card...");
        furi_delay_ms(10000);

        // Scan second card
        scan_second_card(&ctx);

        // Write data from first card to second card
        if(ctx.card_found) {
            FURI_LOG_I(TAG, "Writing data from first card to second card...");
            protocol_dict_set_data(ctx.dict, ctx.protocol, ctx.card_data, ctx.card_data_size);
            lfrfid_worker_write_start(ctx.worker, ctx.protocol, rfid_write_callback, &ctx);
            furi_delay_ms(5000); // Wait for 5s
        } else {
            FURI_LOG_I(TAG, "No second card found within 10s");
        }
    } else {
        FURI_LOG_I(TAG, "No first card found within 10s");
    }

cleanup:
    // Release resources
    lfrfid_worker_stop(ctx.worker);
    lfrfid_worker_stop_thread(ctx.worker);
    lfrfid_worker_free(ctx.worker);
    protocol_dict_free(ctx.dict);
    furi_event_flag_free(ctx.event);
    if(ctx.card_data) free(ctx.card_data);

    furi_hal_serial_deinit(uart_handle);
    furi_hal_serial_control_release(uart_handle);
    FURI_LOG_I(TAG, "==== EXIT serial_rfid_control_main ====");
    return 0;
}
