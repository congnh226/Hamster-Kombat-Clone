import { decorate, observable, computed, action } from "mobx";

class NotificationStore {
    alerts = [];

    get current() {
        return this.alerts.length === 0 ? null : this.alerts[0];
    }

    hide = () => {
        if (this.alerts.length > 0) {
            this.alerts[0].display = false;
        }
    };

    process = () => {
        this.alerts = this.alerts.slice(1);
    };

    push = alert => {
        this.hide();
        this.alerts.push({ ...alert, display: true });
    };
}

decorate(NotificationStore, {
    alerts: observable,
    current: computed,
    hide: action,
    process: action,
    push: action
});

export default new NotificationStore();
