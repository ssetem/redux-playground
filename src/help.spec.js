
import _ from "lodash"
import {createSelector} from "reselect"

let state = {
        payees: {
            '59e8fb254979d23ad41e3fe7': {
                _id: '59e8fb254979d23ad41e3fe7',
                name: 'Marks & Spencers',
                __v: 0,
                updatedAt: '2017-10-23T17:34:17.319Z',
                transactions: []
            },
            '59e8fb54f720f81a004424dd': {
                _id: '59e8fb54f720f81a004424dd',
                name: 'Nandos',
                __v: 0,
                updatedAt: '2017-10-23T17:35:16.464Z',
                transactions: []
            },
            '59e8fbe76e758b2ae8f80201': {
                _id: '59e8fbe76e758b2ae8f80201',
                name: 'McDonalds',
                __v: 0,
                transactions: []
            },
            '59ee26c096b8351b709b5598': {
                _id: '59ee26c096b8351b709b5598',
                createdAt: '2017-10-23T17:28:32.836Z',
                updatedAt: '2017-10-23T17:34:49.940Z',
                name: 'Khatoon',
                __v: 0,
                transactions: []
            },
            '59ee26d96e598f2ba40d8226': {
                _id: '59ee26d96e598f2ba40d8226',
                createdAt: '2017-10-23T17:28:57.818Z',
                updatedAt: '2017-10-23T17:35:08.250Z',
                name: 'Tesco',
                __v: 0,
                transactions: []
            }
        },
        transactions: {
            '59edf69297fb7b22667977f3': {
                _id: '59edf69297fb7b22667977f3',
                value: 19.99,
                __v: 0,
                payee: '59e8fb54f720f81a004424dd',
                updatedAt: '2017-10-23T17:56:30.656Z',
                cleared: false,
                date: '2017-01-05T00:00:00.000Z'
            },
            '59ee2c3778e4f115b45330bf': {
                _id: '59ee2c3778e4f115b45330bf',
                createdAt: '2017-10-23T17:51:51.374Z',
                updatedAt: '2017-10-23T17:51:51.374Z',
                payee: '59e8fb54f720f81a004424dd',
                value: 16.59,
                __v: 0,
                cleared: false,
                date: '2017-10-27T13:49:28.633Z'
            },
            '59f0cd814340ae2cfcf23071': {
                _id: '59f0cd814340ae2cfcf23071',
                createdAt: '2017-10-25T17:44:33.828Z',
                updatedAt: '2017-10-25T17:44:33.828Z',
                ui_id: 'a8104a05-a364-4df2-9413-f1d23f0dc37c',
                value: 78,
                __v: 0,
                payee: null,
                cleared: false,
                date: '2017-10-25T17:44:33.827Z'
            },
            '59f0ce0b4340ae2cfcf23074': {
                _id: '59f0ce0b4340ae2cfcf23074',
                createdAt: '2017-10-25T17:46:51.847Z',
                updatedAt: '2017-10-25T17:46:51.847Z',
                ui_id: 'ba8d2460-501f-4b09-96d8-350d0f02655c',
                value: 54,
                __v: 0,
                payee: null,
                cleared: false,
                date: '2017-10-25T17:46:51.847Z'
            },
            '59f0cfd04340ae2cfcf23079': {
                _id: '59f0cfd04340ae2cfcf23079',
                createdAt: '2017-10-25T17:54:24.618Z',
                updatedAt: '2017-10-25T17:54:24.618Z',
                ui_id: '3d446774-6424-438c-9f42-a6c8cb50b96a',
                value: 54,
                __v: 0,
                payee: null,
                cleared: false,
                date: '2017-10-25T17:54:24.618Z'
            },
            '59f25e52fba2b419fcbc9f8b': {
                _id: '59f25e52fba2b419fcbc9f8b',
                createdAt: '2017-10-26T22:14:42.557Z',
                updatedAt: '2017-10-26T22:14:42.557Z',
                value: 12,
                __v: 0,
                cleared: false,
                date: '2017-10-26T22:14:42.557Z'
            },
            '59f08c0ef8765e1b07154e25': {
                _id: '59f08c0ef8765e1b07154e25',
                createdAt: '2017-10-25T13:05:18.405Z',
                updatedAt: '2017-10-25T13:05:18.405Z',
                value: 12,
                __v: 0,
                payee: null,
                cleared: false,
                date: '2017-10-25T13:05:18.396Z'
            },
            '59f08c2f703b661b18368e55': {
                _id: '59f08c2f703b661b18368e55',
                createdAt: '2017-10-25T13:05:51.823Z',
                updatedAt: '2017-10-25T13:05:51.823Z',
                value: 15.87,
                __v: 0,
                payee: null,
                cleared: false,
                date: '2017-10-25T13:05:51.816Z'
            },
            '59f08c9f703b661b18368e56': {
                _id: '59f08c9f703b661b18368e56',
                createdAt: '2017-10-25T13:07:43.976Z',
                updatedAt: '2017-10-25T13:07:43.976Z',
                value: 213,
                __v: 0,
                payee: null,
                cleared: false,
                date: '2017-10-25T13:07:43.975Z'
            },
            '59f08ca2703b661b18368e57': {
                _id: '59f08ca2703b661b18368e57',
                createdAt: '2017-10-25T13:07:46.252Z',
                updatedAt: '2017-10-25T13:07:46.252Z',
                value: 23,
                __v: 0,
                payee: null,
                cleared: false,
                date: '2017-10-25T13:07:46.252Z'
            },
            '59f08d8b703b661b18368e58': {
                _id: '59f08d8b703b661b18368e58',
                createdAt: '2017-10-25T13:11:39.756Z',
                updatedAt: '2017-10-25T13:11:39.756Z',
                value: 34,
                __v: 0,
                payee: null,
                cleared: false,
                date: '2017-10-25T13:11:39.756Z'
            },
            '59f08e0a703b661b18368e59': {
                _id: '59f08e0a703b661b18368e59',
                createdAt: '2017-10-25T13:13:46.992Z',
                updatedAt: '2017-10-25T13:13:46.992Z',
                value: 12,
                __v: 0,
                payee: null,
                cleared: false,
                date: '2017-10-25T13:13:46.972Z'
            },
            '59f08e0b703b661b18368e5a': {
                _id: '59f08e0b703b661b18368e5a',
                createdAt: '2017-10-25T13:13:47.476Z',
                updatedAt: '2017-10-25T13:13:47.476Z',
                value: 23,
                __v: 0,
                payee: null,
                cleared: false,
                date: '2017-10-25T13:13:47.467Z'
            },
            '59f09005b265df1b9e58dc0f': {
                _id: '59f09005b265df1b9e58dc0f',
                createdAt: '2017-10-25T13:22:13.711Z',
                updatedAt: '2017-10-25T13:22:13.711Z',
                value: 32,
                __v: 0,
                payee: null,
                cleared: false,
                date: '2017-10-25T13:22:13.711Z'
            },
            '59f0906fb265df1b9e58dc11': {
                _id: '59f0906fb265df1b9e58dc11',
                createdAt: '2017-10-25T13:23:59.837Z',
                updatedAt: '2017-10-25T13:23:59.837Z',
                value: 12,
                __v: 0,
                payee: null,
                cleared: false,
                date: '2017-10-25T13:23:59.837Z'
            },
            '59f09008b265df1b9e58dc10': {
                _id: '59f09008b265df1b9e58dc10',
                createdAt: '2017-10-25T13:22:16.230Z',
                updatedAt: '2017-10-25T13:22:16.230Z',
                value: 23,
                __v: 0,
                payee: null,
                cleared: false,
                date: '2017-10-25T13:22:16.230Z'
            },
            '59f08f75b265df1b9e58dc0e': {
                _id: '59f08f75b265df1b9e58dc0e',
                createdAt: '2017-10-25T13:19:49.799Z',
                updatedAt: '2017-10-25T13:19:49.799Z',
                value: 12,
                __v: 0,
                payee: null,
                cleared: false,
                date: '2017-10-25T13:19:49.793Z'
            },
            '59f09070b265df1b9e58dc12': {
                _id: '59f09070b265df1b9e58dc12',
                createdAt: '2017-10-25T13:24:00.905Z',
                updatedAt: '2017-10-25T13:24:00.905Z',
                value: 23,
                __v: 0,
                payee: null,
                cleared: false,
                date: '2017-10-25T13:24:00.897Z'
            },
            '59f0910fb265df1b9e58dc15': {
                _id: '59f0910fb265df1b9e58dc15',
                createdAt: '2017-10-25T13:26:39.250Z',
                updatedAt: '2017-10-25T13:26:39.250Z',
                value: 23,
                __v: 0,
                payee: null,
                cleared: false,
                date: '2017-10-25T13:26:39.250Z'
            },
            '59f090eeb265df1b9e58dc14': {
                _id: '59f090eeb265df1b9e58dc14',
                createdAt: '2017-10-25T13:26:06.230Z',
                updatedAt: '2017-10-25T13:26:06.230Z',
                value: 1,
                __v: 0,
                payee: null,
                cleared: false,
                date: '2017-10-25T13:26:06.229Z'
            }
        }
    };
describe("help", function(){


    it("should work", ()=> {
        const getPayees = (state) => state.payees

        const getTransactions = (state) => state.transactions

        export const getTransactionsForDisplay = createSelector(
            [getTransactions, getPayees],
            (transactions, payees) => {
                let payeeIds = _.compact(_.uniq(_.map(transactions, "payee")))
                let payeesInTransaction = _.map(payeeIds, (payeeId)=> payees[payeeId])

                return {
                    transactions,
                    payess:payeesInTransaction
                }
            }
        )
        console.log(getTransactionsForDisplay(state))
    })


})