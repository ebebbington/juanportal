import 'mocha'
const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
chai.should()
import SocketIO from "socket.io-client"

describe('Socket Server', () => {

    describe('Methods', () => {

        describe('`handle`', function () {

            it('Should emit a `profileDeletedEvent` when receiving one', async () => {
                const client1 = SocketIO('http://127.0.0.1:9009', {multiplex: false})
                const client2 = SocketIO('http://127.0.0.1:9009', {multiplex: false})
                const client2Id = client2.id
                const data = { profileId: 2 }
                setTimeout(() => {
                    client2.emit('profileDeleted', data)
                }, 1000)
                await client1.on('profileDeleted', (data: any) => {
                    expect(data.profileId).to.equal(2)
                    client1.disconnect()
                    client2.disconnect()
                })
            })

        })

    })

})