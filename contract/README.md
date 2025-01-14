# Contract

## Compile contract (to check any error, and prepare the michelson outputfile to deploy later) 

```bash
ligo compile contract ./src/contract.jsligo --output-file contract.tz --protocol kathmandu

ligo compile storage ./src/contract.jsligo '{treasuryAddress : "tz1VApBuWHuaTfDHtKzU3NBtWFYsxJvvWhYk" as address,faPendingDeposits : Map.empty as faPendingMapType, faPendingWithdrawals : Map.empty as faPendingMapType}' --output-file contractStorage.tz --protocol kathmandu
```

## Deploy

```bash
tezos-client originate contract tzportalKathmandu transferring 0 from myFirstKey running contract.tz --init "$(cat contractStorage.tz)" --burn-cap 1 --force
```

- Jakarta : KT1WknoW9XN6ZpvsnMmsuPZ6tvTkF4FqYCQ6
- Ghostnet : KT1QvZPUoXwz5zQL6zDpFyyPp5iChbHfnXC1
- Kathmandunet : KT1E8QEK4tkm1P3FRrm66hzX8zpDshBth5Lu

## Run tests 

```bash
ligo run test ./test/unit_contract.jsligo
```

## Interact

```bash
ligo compile parameter ./src/contract.jsligo 'Deposit(XTZ_OP({amountToTransfer : 42000000 as nat,l2Address : L1_ADDRESS("tz1VApBuWHuaTfDHtKzU3NBtWFYsxJvvWhYk" as address) ,rollupAddress : "KT1TLVFbGtkX6bS9tUKmRGPqGtf1K6SGgqXK" as address}))' --output-file contractParameter.tz  --protocol kathmandu

(or FA1.2
ligo compile parameter ./src/contract.jsligo 'Deposit(FA12_OP({amountToTransfer : 1 as nat,fa12Address : "KT1WnDswMHZefo2fym6Q9c8hnL3sEuzFb2Dt" as address,l2Address : "tz1VApBuWHuaTfDHtKzU3NBtWFYsxJvvWhYk" as address,rollupAddress : "txr1Q4iYZti8wfKXJi9CyagSnAHCogzX877kD" as address}))' --output-file contractParameter.tz  --protocol kathmandu
)


tezos-client transfer 42 from myFirstKey to KT1Ci5heqWbRmxM98769W7jqVxCZ9zZUQ31o --arg '(Left (Right (Pair 42000000 "KT1TLVFbGtkX6bS9tUKmRGPqGtf1K6SGgqXK" (Left "tz1VApBuWHuaTfDHtKzU3NBtWFYsxJvvWhYk"))))' --burn-cap 1
```

# FA1.2 Contract

## Ctez

ligo compile contract ./test/fa12.mligo --entry-point main --output-file ./test/fa12.tz --protocol kathmandu

ligo compile storage ./test/fa12.mligo "$(cat ./test/fa12_ctez_storage.mligo)" --entry-point main  --output-file ./test/fa12_ctez_storage.tz --protocol kathmandu

tezos-client originate contract fa12CTEZKathmandunet transferring 0 from alice running ./test/fa12.tz --init "$(cat ./test/fa12_ctez_storage.tz)"   --burn-cap 1

## kusd

ligo compile contract ./test/fa12.mligo --entry-point main --output-file ./test/fa12.tz --protocol kathmandu

ligo compile storage ./test/fa12.mligo "$(cat ./test/fa12_kusd_storage.mligo)" --entry-point main  --output-file ./test/fa12_kusd_storage.tz --protocol kathmandu

tezos-client originate contract fa12KUSDKathmandunet transferring 0 from alice running ./test/fa12.tz --init "$(cat ./test/fa12_kusd_storage.tz)"   --burn-cap 1

# FA2 Contract

### uUSD 

ligo compile contract ./test/fa2.jsligo --entry-point main --output-file ./test/fa2.tz --protocol kathmandu

ligo compile storage ./test/fa2.jsligo "$(cat ./test/fa2_uUSD_storage.jsligo)" --entry-point main  --output-file ./test/fa2_uUSD_storage.tz --protocol kathmandu

ligo compile parameter ./test/fa2.jsligo 'Transfer(list([{    from_ :  "tz1VApBuWHuaTfDHtKzU3NBtWFYsxJvvWhYk" as address,  tx    : list([ {    to_      : "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb" as address,    token_id : 0 as nat,    quantity : 10000000000 as nat  }  ]) as list<atomic_trans>  }]))' --output-file ./test/fa2Parameter.tz --protocol kathmandu

tezos-client originate contract fa2uUSDKathmandunet transferring 0 from alice running ./test/fa2.tz --init "$(cat ./test/fa2_uUSD_storage.tz)"   --burn-cap 1

tezos-client transfer 0 from myFirstKey to fa2uUSDKathmandunet --arg "$(cat ./test/fa2Parameter.tz)" --burn-cap 1


## EURL

ligo compile contract ./test/fa2.jsligo --entry-point main --output-file ./test/fa2.tz --protocol kathmandu

ligo compile storage ./test/fa2.jsligo "$(cat ./test/fa2_EURL_storage.jsligo)" --entry-point main  --output-file ./test/fa2_EURL_storage.tz --protocol kathmandu

ligo compile parameter ./test/fa2.jsligo 'Transfer(list([{    from_ :  "tz1VApBuWHuaTfDHtKzU3NBtWFYsxJvvWhYk" as address,  tx    : list([ {    to_      : "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb" as address,    token_id : 0 as nat,    quantity : 10000000000 as nat  }  ]) as list<atomic_trans>  }]))' --output-file ./test/fa2Parameter.tz --protocol kathmandu

tezos-client originate contract fa2EURLKathmandunet transferring 0 from alice running ./test/fa2.tz --init "$(cat ./test/fa2_EURL_storage.tz)"   --burn-cap 1


tezos-client transfer 0 from myFirstKey to fa2EURLKathmandunet --arg "$(cat ./test/fa2Parameter.tz)" --burn-cap 1

# Mocked rollup Contract


## compile

```
ligo compile contract ./test/mock_deku_rollup.jsligo --output-file ./test/mock_deku_rollup.tz --protocol kathmandu
```



## deploy

```
tezos-client originate contract mock_rollup transferring 0 from myFirstKey running ./test/mock_rollup.tz  --init "{}"  --burn-cap 1
```

# REAL Rollup

Originate

```bash
tezos-client originate tx rollup from myFirstKey --burn-cap 100 
```
>BMLz4JnaDS7yUNtF51EWrspUEKAzWsikcrkbpTtmuJ8rzQcQdQt
>tz1VApBuWHuaTfDHtKzU3NBtWFYsxJvvWhYk
>txr1Q4iYZti8wfKXJi9CyagSnAHCogzX877kD

Submit operations

```bash
tezos-client submit tx rollup batch 0x626c6f62 to txr1Q4iYZti8wfKXJi9CyagSnAHCogzX877kD from tz1VApBuWHuaTfDHtKzU3NBtWFYsxJvvWhYk
```

Watch the inbox

```bash
tezos-client rpc get /chains/main/blocks/head/context/tx_rollup/txr1Q4iYZti8wfKXJi9CyagSnAHCogzX877kD/inbox/0
```

