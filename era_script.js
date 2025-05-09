const theSwitch_1 = document.getElementById('the_switch_1');  /* Tạo tham chiếu tới phần tử HTML có id là 'the_switch' */
const theSwitch_2 = document.getElementById('the_switch_2');
const temperature_input = document.getElementById('temperature_sensor');
let configLed1 = null, newStatusLed1 = null;  /* Khởi tạo các biến dùng để lưu cấu hình và trạng thái đèn LED  */
let configLed2 = null, newStatusLed2 = null;
let configTemperature = null, temperatureValue = 0; // Khởi tạo giá trị giá trị mặc định
const dataBuffer = [];
let actions = [];

/* Tạo đối tượng EraWidget và gọi hàm khởi tạo với các cấu hình cần thiết */
const eraWidget = new EraWidget();
eraWidget.init({
    needRealtimeConfigs: true,         /* Cần giá trị hiện thời */
    needHistoryConfigs: true,          /* Cần giá trị lịch sử */
    needActions: true,                 /* Cần các hành động (ví dụ Bật/Tắt đèn) */
    maxRealtimeConfigsCount: 10,       /* Số lượng tối đa giá trị hiện thời */
    maxHistoryConfigsCount: 1,         /* Số lượng tối đa giá trị lịch sử */
    maxActionsCount: 4,                /* Số lượng tối đa các hành động có thể kích hoạt */
    minRealtimeConfigsCount: 0,        /* Số lượng tối thiểu giá trị hiện thời */
    minHistoryConfigsCount: 0,         /* Số lượng tối thiểu giá trị lịch sử */
    minActionsCount: 0,                /* Số lượng tối thiểu hành động */

    /* Hàm callback được gọi khi có cấu hình được nhận từ server */
    onConfiguration: (configuration) => {
        /* Cập nhật cấu hình đèn LED từ cấu hình thời gian thực đầu tiên */
        configLed1 = configuration.realtime_configs[0];
        configLed2 = configuration.realtime_configs[1];
        configTemperature = configuration.realtime_configs[2];
        actions = configuration.actions; /* Lưu danh sách các hành động được nhận */
    },

    /* Hàm callback được gọi khi nhận giá trị mới từ server */
    onValues: (values) => {
        /* Lấy trạng thái hiện tại của đèn LED từ giá trị của cấu hình */
        const stateLed1 = values[configLed1.id]?.value;
        const stateLed2 = values[configLed2.id]?.value;

        temperatureValue = values[configTemperature.id]?.value; // Giả sử values[config.id].value là giá trị thực tế
        temperature_input.checked = values[configTemperature.id]?.value > 0; // Đặt trạng thái của checkbox dựa trên giá trị

        /* Kiểm tra nếu trạng thái đèn thay đổi */
        if (newStatusLed1 !== stateLed1) {
            newStatusLed1 = stateLed1;      /* Cập nhật trạng thái mới của đèn */
            theSwitch_1.checked = stateLed1; /* Thay đổi trạng thái của switch dựa trên trạng thái đèn */
        }

        if (newStatusLed2 !== stateLed2) {
            newStatusLed2 = stateLed2;
            theSwitch_2.checked = stateLed2;
        }
    },
});

/* Thêm sự kiện khi người dùng nhấp vào switch để kích hoạt hành động */
theSwitch_1.addEventListener('click', () => {
    if (newStatusLed1 === 1) {
        eraWidget.triggerAction(actions[1]?.action, null); /* Kích hoạt hành động 'Tắt' */
    } else {
        eraWidget.triggerAction(actions[0]?.action, null); /* Kích hoạt hành động 'Bật' */
    }
});

theSwitch_2.addEventListener('click', () => {
    if (newStatusLed2 === 1) {
        eraWidget.triggerAction(actions[3]?.action, null); // tắt LED 2
    } else {
        eraWidget.triggerAction(actions[2]?.action, null); // bật LED 2
    }
});