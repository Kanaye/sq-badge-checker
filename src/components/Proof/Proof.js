import React, { useReducer } from 'react';
import StellarSdk from 'stellar-sdk'
import albedo from '@albedo-link/intent'
import {isValidSig} from '../../lib/utils.js'
import {badgeDetails} from '../../lib/badgeDetails.js'

// const badgeAssetCodes = badgeDetails.reduce((acc, item) => acc.concat(item.code), [])
// console.log(badgeAssetCodes)

const initialState = {
  pubkey: '',
  assets: [{}]
}

function questerReducer(state = initialState, action) {
  switch (action.type) {
    case 'login':
      let newState = {...state}
      newState.pubkey = action.pubkey
      return newState
    default:
      return state
  }
}

export default function Proof() {
  const [quester, setQuester] = useReducer(questerReducer, initialState)

  async function login() {
    let tokenToSign = 'QWxsIGhhaWwgQGthbGVwYWlsIQ=='
    await albedo.publicKey({
      token: tokenToSign
    })
    .then(res => {
      if (isValidSig(res.pubkey, tokenToSign, res.signature)) {
        setQuester({pubkey: res.pubkey, type: 'login'})
      }
    })
  }

  // Function to get the assets on the account that match the SQ code and issuer
  // This is working, but I'm not sure if it accurately removes any asset that
  // a user may have purchased...
  async function getQuestAssets(pubkey) {
    let server = new StellarSdk.Server('https://horizon.stellar.org')
    await server.accounts().accountId(pubkey).call()
    .then(res => {
      // console.log(res.balances)
      let r = res.balances
        .filter((item) => badgeDetails.find(({code, issuer}) => item.asset_code === code && item.asset_issuer === issuer))
        // .filter(item => badgeAssetCodes.includes(item.asset_code))
      console.log(r)
    })
  }

  async function getQuestPayments(pubkey) {
    let server = new StellarSdk.Server('https://horizon.stellar.org')
    await server.payments().forAccount(pubkey).limit(50).call()
    .then(res => {
      let r = res.records
        .filter(item => item.type === 'payment' && item.asset_type !== 'native')
        .filter(item => badgeDetails.find(({code, issuer}) => item.asset_code === code && item.from === issuer))
      console.log(r)
    })
  }

  return (
    <div className="wrapper">
      <div>Prove yourself as a worthy Quester!</div>
      <p>Your Public Key: <code>{quester.pubkey}</code></p>
      <button type="button" className="btn btn-primary" onClick={login}>Prove It!</button>
      <button type="button" className="btn btn-success" onClick={() => getQuestPayments(quester.pubkey)}>Get Assets</button>

    </div>
  )
}
