  /**function to check if metamask in installed */
const checkInstalled = () => {
  if (typeof window.ethereum == 'undefined') {
    return false;
  } else {
    $('#metamask').on('click', connectWithMetamask);
    return true;
  }
}

/** Function to connect to metamask */
const connectWithMetamask = async () => {
  // A Web3Provider wraps a standard Web3 provider, which is
  // what MetaMask injects as window.ethereum into each page
  window.provider = new ethers.providers.Web3Provider(window.ethereum);
  // MetaMask requires requesting permission to connect users accounts
  const accounts = await provider.send("eth_requestAccounts", []);
  const address =  await accounts[0];

  // The MetaMask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer...
  const signer = provider.getSigner()

  const page = window.location.pathname;
  if (page === '/login') {
    $('#web3_address').val(address);
    $('#submit').click();
  } else if (page === '/register') {
    $('#web3_address').val(address);
    $('#email').val(`${address}@internal.kitchenmanager`);
    $('#f_name').val('EOA')
    $('#l_name').val('EOA')
    $('#google_id').val('EOA')
    $('#password').val(address);
    $('#confirm_password').val(address);
    $('#mnemonic').val("EOA");
    $('#priv').val("EOA");
    $('#submit').click();
  } else if  (page === '/owner/addemployee') {
    $('#web3_address').val(address);
    $('#email').val(`${address}@internal.kitchenmanager`);
    $('#google_id').val('EOA')
    $('#password').val(address);
    $('#confirm_password').val(address);
    $('#mnemonic').val("EOA");
    $('#priv').val("EOA");
  }


  return true;
}

  /**
 * Function to handle Google Signin response
 * @param {*} response 
 */
function handleCredentialResponse(response) {
  const page = window.location.pathname;
  const userCredential = decodeJWT(response.credential);
  if (page === '/login') {
    $('#google_id').val(userCredential.sub);
    $('#submit').click();
  } else if (page === '/register') {
    const wallet = createWallet();
    $('#web3_address').val(wallet.address);
    $('#priv').val(wallet.privateKey);
    $('#mnemonic').val(wallet.mnemonic.phrase);
    $('#f_name').val(userCredential.given_name);
    $('#l_name').val(userCredential.family_name);
    $('#google_id').val(userCredential.sub);
    $('#email').val(userCredential.email);
    $('#password').val("googleaccount");
    $('#confirm_password').val("googleaccount");
    $('#submit').click();
  } else if  (page === '/owner/addemployee') {
    const wallet = createWallet();
    $('#web3_address').val(wallet.address);
    $('#priv').val(wallet.privateKey);
    $('#mnemonic').val(wallet.mnemonic.phrase);
    $('#google_id').val(userCredential.sub);
    $('#email').val(userCredential.email);
    $('#password').val("googleaccount");
    $('#confirm_password').val("googleaccount");
  }    
}

/**
 * Function to decode Google user credentials
 * @param {*} credential 
 * @returns 
 */
const decodeJWT = (credential) => {
  var tokens = credential.split('.');
  return JSON.parse(atob(tokens[1]));
}

/**
 * Function to create a new wallet
 * @returns {ethers.Wallet}
 */
const createWallet = () => {
  const wallet = ethers.Wallet.createRandom()
  return wallet;
}

/**
 * Event listener to handle the user's choice of account type
 */
const handleConnectionChoice = () => {
  const page = window.location.pathname;
  if ($('#account_type').val() === '1') {
    connectWithMetamask();
  } else if ($('#account_type').val() === '2') {
    const wallet = createWallet();
    $('#web3_address').val(wallet.address);
    $('#priv').val(wallet.privateKey);
    $('#mnemonic').val(wallet.mnemonic.phrase);  
  } 
}

$(document).ready(function(){
  $('.sidenav').sidenav();
  $('select').formSelect();
  $('#account_type').on('change', handleConnectionChoice);
});
