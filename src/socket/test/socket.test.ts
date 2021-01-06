import 'mocha'
const chai = require('chai')
const expect = chai.expect
chai.should()
import SocketIO from "socket.io-client"

describe('Socket Server', () => {

    describe('Methods', () => {

        describe('`handle`', function () {

            it('Should emit a `profileDeletedEvent` when receiving one', async () => {
                const client1 = SocketIO('http://127.0.0.1:9009', {multiplex: false})
                const client2 = SocketIO('http://127.0.0.1:9009', {multiplex: false})
                const data = { profileId: 2 }
                setTimeout(() => {
                    client2.emit('profileDeleted', data)
                }, 1000)
                // TODO FIXME THIS DOESNT WORK
                await client1.on('profileDeleted', (event: any) => {
                    expect(event.profileId).to.equal(2)
                    client1.disconnect()
                    client2.disconnect()
                })
            })

        })

    })

})