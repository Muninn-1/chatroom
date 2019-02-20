const expect = require('expect');

const  { Users } = require('./users');

describe('Users', () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name:'Pierre',
            room: 'Heaven'
        }, {
            id: '2',
            name:'Paul',
            room: 'Heaven'
        }, {
            id: '3',
            name:'Lucifer',
            room: 'Hell'
        }, {
            id: '4',
            name:'Jean',
            room: 'Heaven'
        }]
    });

    // Testing addUser()
    it('should add new user', () => {
        let users = new Users();
        let user = {
            id: '666',
            name: 'Lucifer',
            room: 'Hell'
        };
        let resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    // Testing removeUser()
    it('should remove a user', () => {
        let userId = '2';
        let user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(3);
    });

    it('should not remove user', () => {
        let userId = '99';
        let user = users.removeUser(userId);

        expect(user).toNotExist();
        expect(users.users.length).toBe(4);
    });

    // Testing getUser()
    it('should find user', () => {
        let userId = '2';
        let user = users.getUser(userId);
        
        expect(user.id).toBe(userId);
    });

    it('should not find user', () => {
        let userId = '99';
        let user = users.getUser(userId);
        
        expect(user).toNotExist();
    });

    // Testing getUserList()
    it('should return names for heaven room', () => {
        let userList = users.getUserList('Heaven');

        expect(userList).toEqual(['Pierre', 'Paul', 'Jean']);
    });

    it('should return names for hell room', () => {
        let userList = users.getUserList('Hell');

        expect(userList).toEqual(['Lucifer']);
    });
});