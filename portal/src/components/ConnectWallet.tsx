import React, { Dispatch, Fragment, SetStateAction, useEffect } from "react";
import { BigMapAbstraction, TezosToolkit, WalletContract } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import {
    AccountInfo,
    NetworkType
} from "@airgap/beacon-types";
import Button from "@mui/material/Button";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { PAGES } from "../App";
import { FA12Contract } from "./fa12Contract";
import BigNumber from 'bignumber.js';
import { Avatar, Chip } from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";
import { LAYER2Type } from "./TezosUtils";


type ButtonProps = {
    Tezos: TezosToolkit;
    setWallet: Dispatch<SetStateAction<any>>;
    userAddress:string;
    setUserAddress: Dispatch<SetStateAction<string>>;
    wallet: BeaconWallet;
    disconnectWallet:any;
    activeAccount : AccountInfo;
    setActiveAccount :  Dispatch<SetStateAction<AccountInfo|undefined>>;
    accounts : AccountInfo[];
};

const ConnectButton = ({
    Tezos,
    setWallet,
    userAddress,
    setUserAddress,
    wallet,
    disconnectWallet,
    activeAccount,
    setActiveAccount,
    accounts
}: ButtonProps): JSX.Element => {

    const setL1AccountAsActive = async() => {
        const l1Account : AccountInfo | undefined = accounts.find((a)=> {return a.address == userAddress && a.accountIdentifier!==LAYER2Type.L2_DEKU}); 
        setActiveAccount(l1Account);
    }

    const connectWallet = async (): Promise<void> => {
        try {
            await wallet.requestPermissions({
                network: {
                    type: process.env["REACT_APP_NETWORK"]? NetworkType[process.env["REACT_APP_NETWORK"].toUpperCase() as keyof typeof NetworkType]  : NetworkType.JAKARTANET,
                    rpcUrl: process.env["REACT_APP_TEZOS_NODE"]!
                }
            });
            //force refresh here like this
            const activeAccount = (await wallet.client.getActiveAccount())as AccountInfo;
            setUserAddress(activeAccount!.address);
            console.log("Connected to Layer 1");
            setActiveAccount(activeAccount);
            accounts.push(activeAccount);
        } catch (error) {
            console.log(error);
        }
    };

    return (<Fragment>
        {!userAddress || userAddress === ""?
            <Button variant="contained" onClick={connectWallet}>
               <AccountBalanceWalletIcon /> &nbsp; Connect L1 Tezos
            </Button>
            :<Chip onClick={()=>setL1AccountAsActive()}  avatar={<Avatar src="XTZ.png" />}
 variant={activeAccount?.address == userAddress && activeAccount.accountIdentifier!==LAYER2Type.L2_DEKU ?"filled":"outlined"}  color="secondary"      onDelete={disconnectWallet}     label={userAddress} deleteIcon={<LogoutOutlined />}/> }
         </Fragment>
    );
};

export default ConnectButton;


