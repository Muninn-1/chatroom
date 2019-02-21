class Users {
    constructor () {
        this.users = [];
    };
    
    // Add a new user to the users list
    addUser (id, name, language, room) {
        let user = {id, name, language, room};

        this.users.push(user);
        return user;
    };
    
    // Get one specific user from the users list
    getUser (id) {
        return this.users.filter(user => user.id === id)[0];
    };

    // Remove one specific user from the users list
    removeUser (id) {
        let user = this.getUser(id);
        
        if(user) {
            this.users = this.users.filter(user => user.id !== id);
        }
        return user;
    };

    // Get the users list
    getUserList (room) {
        let users = this.users.filter(user => user.room === room);
        let namesArray = users.map(user => user.name);
        
        return namesArray;
    };

    getRoomList (room = "") {
        let rooms = this.users.map(user => user.room);
        let roomList = rooms.filter((room, index) => rooms.indexOf(room) === index);

        if(!roomList.includes(room) && room !== "") {
            roomList.push(room);
        }
        return roomList;
    }
};

module.exports = { Users }