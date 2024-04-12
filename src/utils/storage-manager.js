export class StorageManager {
    static checkUserData() {
        const name = sessionStorage.getItem('name');
        const lastName = sessionStorage.getItem('lastName');
        const email = sessionStorage.getItem('email');

        if (!name || !lastName || !email) {
            sessionStorage.clear();
            location.href = '#/';
        }
    }
}