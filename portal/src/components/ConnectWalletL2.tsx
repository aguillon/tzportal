import { ChangeEvent, Dispatch, Fragment, SetStateAction } from "react";
import {  TezosToolkit } from "@taquito/taquito";

import { AccountInfo, NetworkType, Origin} from "@airgap/beacon-types";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import Button from "@mui/material/Button";

import { Avatar, Chip } from "@mui/material";
import {  LogoutOutlined } from "@mui/icons-material";
import { InMemorySigner } from "@taquito/signer";
import { LAYER2Type } from "./TezosUtils";
import { DEKUWallet } from "./DEKUClient";




type ButtonProps = {
    userL2Address:string;
    setUserL2Address: Dispatch<SetStateAction<string>>;
    TezosL2: TezosToolkit;
    activeAccount : AccountInfo;
    setActiveAccount :  Dispatch<SetStateAction<AccountInfo|undefined>>;
    accounts : AccountInfo[];
    disconnectWalletL2:any;
};



const ConnectButtonL2 = ({
    userL2Address,
    setUserL2Address,
    TezosL2,
    activeAccount,
    setActiveAccount,
    accounts,
    disconnectWalletL2
}: ButtonProps): JSX.Element => {
    
    const setL2AccountAsActive = async() => {
        const l2Account : AccountInfo | undefined = accounts.find((a)=> {return a.address == userL2Address && a.accountIdentifier===LAYER2Type.L2_DEKU}); 
        setActiveAccount(l2Account);
    }
   
    const connectWallet = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }
        const file = e.target.files[0];
        const fileReader = new FileReader();
        
        fileReader.readAsText(file);
        fileReader.onload = async(e) => {
            if (!e?.target?.result) {
                return;
            }
            const l2Wallet : DEKUWallet = JSON.parse(e.target.result as string);
            setUserL2Address(l2Wallet.address);

            const accountInfo : AccountInfo = { address: l2Wallet.address,
                network: {
                    type: NetworkType[process.env["REACT_APP_NETWORK"]!.toUpperCase() as keyof typeof NetworkType]
                } ,
                scopes: [],
                accountIdentifier: LAYER2Type.L2_DEKU,
                senderId: "string",
                origin: {
                    type: Origin.EXTENSION,
                    id: "string"
                },
                publicKey: "string",
                connectedAt: new Date().getTime()
            } as AccountInfo;
            if(accounts.length == 0)setActiveAccount(accountInfo);
            accounts.push(accountInfo);
            TezosL2.setProvider({ signer: await InMemorySigner.fromSecretKey(l2Wallet.priv_key) });
           
            console.log("Connected to Layer 2");

        };
    };
    
    return (
        <Fragment>
        {!userL2Address?
            
            
            
            <Button
            variant="contained"
            component="label"
            ><AccountBalanceWalletIcon />  &nbsp;
            Upload L2 wallet file
            <input
            type="file"
            hidden
            onChange={(e: ChangeEvent<HTMLInputElement>)=>connectWallet(e)}
            />
            </Button>
            
            :<Chip  onClick={setL2AccountAsActive} avatar={<Avatar src="DEKU.png" />}
            variant={activeAccount?.address == userL2Address && activeAccount.accountIdentifier===LAYER2Type.L2_DEKU?"filled":"outlined"} color="secondary"  onDelete={disconnectWalletL2}   label={userL2Address} deleteIcon={<LogoutOutlined />}/> }
            </Fragment>
            );
        };
        
        export default ConnectButtonL2;