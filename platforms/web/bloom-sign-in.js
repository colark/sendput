import * as React from 'react'
import {RequestQRCode, RequestData} from '@bloomprotocol/share-kit'

const MyComponent = props => {
  const requestData = {
    action: "request_attestation_data",
    token: 'Ellie',
    url: 'https://997a56f1.ngrok.io/receiveData',
    org_logo_url: 'https://bloom.co/images/notif/bloom-logo.png',
    org_name: 'Sendput',
    org_usage_policy_url: 'https://bloom.co/legal/terms',
    org_privacy_policy_url: 'https://bloom.co/legal/privacy',
    types: ['email'],
  }
  return <div style={{padding: "20px"}}><RequestQRCode requestData={requestData} size={200} /></div>
}

export default MyComponent;