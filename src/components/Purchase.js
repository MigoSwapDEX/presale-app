/* eslint-disable eqeqeq */
/* eslint-disable no-throw-literal */
import { useEffect, useRef, useState } from "react";
import Web3 from "web3";
import toast, { Toaster } from "react-hot-toast";
import { IconContext } from "react-icons";
import { FaWallet, FaShoppingCart } from "react-icons/fa";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { BsCoin, BsCashCoin, BsBoxArrowUpRight } from "react-icons/bs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import saleABI from "../helpers/saleABI";
import minABI from "../helpers/fswapABI";
import { saleAddress, fswapAddress } from "../helpers/contractAddresses";

ChartJS.register(ArcElement, Tooltip, Legend);

// Mainnet addresses
// Make sure to update other details to reflect Mainnet
const netID = 1116;
const mainnetRPC = "https://rpc.coredao.org";

const web3Inst = new Web3(mainnetRPC);
const saleContractInst = new web3Inst.eth.Contract(saleABI, saleAddress);
const fswapContractInst = new web3Inst.eth.Contract(minABI, fswapAddress);

function Purchase({ account, initWeb3, getBalances }) {
  const [amountBought, setAmountBought] = useState(0);
  const [amountRemaining, setAmountRemaining] = useState(0);
  const [claimPeriod, setClaimPeriod] = useState(0);
  const [amountForPresale, setAmountForPresale] = useState(30000000);
  const [canUserClaim, setCanUserClaim] = useState(false);

  const [errMessage, setErrMessage] = useState("");
  const [sucMessage, setSucMessage] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [acct, setAcct] = useState("");
  const [btaAmt, setBtaAmt] = useState("");
  const [connected, setConnected] = useState(false);
  // const [isMetaMask, setIsMetaMask] = useState(false);
  // const [MMProvider, setMMProvider] = useState({});
  // const [web3Installed, setWeb3Installed] = useState(false);
  const [ftmBal, setFtmBal] = useState(0);
  const [mmdBal, setMmdBal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isClaimLoading, setClaimIsLoading] = useState(false);

  async function buyPresale() {
    try {
      if (account === "")
        throw { message: "Please Connect Wallet", custom: true };

      const netid = await initWeb3.eth.net.getId();

      if (netid !== netID) {
        throw { message: "Change To The CORE Mainnet", custom: true };
      }

      if (btaAmt === "") throw { message: "Enter CORE Amount", custom: true };

      if (isNaN(btaAmt))
        throw { message: "Please Type In A Number", custom: true };

      if (btaAmt <= 0)
        throw {
          message: "CORE Amount Must Be Greater Than Zero",
          custom: true,
        };
      // const isListed = await isWhiteListed(account);
      // if (isListed != true) {
      //   throw { message: "You Are Not WhiteListed", custom: true };
      // }

      setIsLoading(true);
      const gasPrice = await initWeb3.eth.getGasPrice();
      // const gas = "0xC350";

      const txParameters = {
        from: account,
        to: saleAddress,
        value: initWeb3.utils.toWei(btaAmt, "ether"),
        gasPrice: gasPrice,
        gas: 10000000,
      };

      const data = await initWeb3.eth.sendTransaction(txParameters);

      const txHash = data.transactionHash;

      const expectedBlockTime = 1000;
      const sleep = (milliseconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
      };
      let transactionReceipt = null;

      while (transactionReceipt == null) {
        transactionReceipt = await initWeb3.eth.getTransactionReceipt(txHash);
        await sleep(expectedBlockTime);
      }

      if (transactionReceipt.status) {
        setSuccess(true);
        // setError(false);

        const link = `https://scan.coredao.org/tx/${transactionReceipt.transactionHash}`;

        const atag = <a href={link}>Successful. View on CORE explorer</a>;
        (() => toast.success(atag))();
        updateBalances();

        setBtaAmt("");
        // const period = await getClaimPeriods(account);
        // setClaimPeriod(period);
        setIsLoading(false);
      } else {
        setError(true);
        setErrMessage("Presale Purchase Failed");
        (() => toast.error("Presale Purchase Failed"))();
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (error.custom) {
        setErrMessage(error.message);
        (() => toast.error(error.message))();
      } else if (error.code === 4001) {
        setErrMessage("Txn Signing Rejected");
        (() => toast.error("Txn Signing Rejected"))();
      } else {
        const msg = "Code: " + error.code + ", Msg: " + error.message;
        // setMessage("Transaction Failed");
        // setErrMessage(msg);
        (() => toast.error("Transaction Failed"))();
      }
      setError(true);
      setIsLoading(false);

      // Load the balances
      // getFtmBalance(account);
      // getMmdBalance(account);
    }
  }

  // Claim token
  async function claimToken() {
    try {
      if (account === "")
        throw { message: "Please Connect Wallet", custom: true };

      const netid = await initWeb3.eth.net.getId();

      if (netid !== netID) {
        throw { message: "Please Change To The CORE Mainnet", custom: true };
      }
      const saleContract = new initWeb3.eth.Contract(saleABI, saleAddress);
      // purchasedAmountPerUser
      const migoBal = await saleContract.methods
        .purchasedAmountPerUser(account)
        .call();
      const roundedMBal = Number((parseFloat(migoBal) / 10 ** 18).toFixed(5));
      if (!(roundedMBal > 0)) {
        throw { message: "You Have No Migo To Claim", custom: true };
      }
      setClaimIsLoading(true);
      const claimReceipt = await saleContract.methods
        .claimTokens(account)
        .send({ from: account });
      const claimEvent = claimReceipt.events.TokensClaimed;
      if (claimReceipt.events !== "undefined") {
        if (claimEvent !== "undefined") {
          const amountClaimed = claimEvent.returnValues.amount;
          const claimer = claimEvent.returnValues.claimer;
          const txHash = claimEvent.transactionHash;
          const link = `https://scan.coredao.org/tx/${txHash}`;

          const atag = (
            <a target="_blank" rel="noreferrer noopener" href={link}>
              Claim Successful. View on CORE explorer
            </a>
          );
          (() => toast.success(atag))();
          updateBalances();
          setClaimIsLoading(false);
        }
      }
    } catch (error) {
      //
      console.log(error);
      if (error.custom) {
        setErrMessage(error.message);
        (() => toast.error(error.message))();
      } else if (error.code === 4001) {
        setErrMessage("Txn Signing Rejected");
        (() => toast.error("Txn Signing Rejected"))();
      } else {
        // const msg = "Code: " + error.code + ", Msg: " + error.message;
        // setErrMessage(msg);
        (() => toast.error("Transaction Failed"))();
      }
      setError(true);
      setClaimIsLoading(false);
      updateBalances();
    }
  }

  // async function getClaimPeriods(acct) {
  //   const saleContract = new initWeb3.eth.Contract(saleABI, saleAddress);
  //   const period = await saleContract.methods.claimTime().call();
  //   return period;
  // }

  async function canClaim() {
    const saleContract = new initWeb3.eth.Contract(saleABI, saleAddress);
    const userCanClaim = await saleContract.methods.canClaim().call();
    setCanUserClaim(userCanClaim);
    return userCanClaim;
  }

  async function isWhiteListed(acct) {
    const saleContract = new initWeb3.eth.Contract(saleABI, saleAddress);
    const isListed = await saleContract.methods.whitelist(acct).call();
    return isListed;
  }

  //whitelist

  async function updateBalances() {
    if (account !== "" && initWeb3 !== "undefined") {
      const bal = await initWeb3.utils.fromWei(
        await initWeb3.eth.getBalance(account)
      );
      const roundedBBal = Number(parseFloat(bal).toFixed(5));
      const fswapContract = new initWeb3.eth.Contract(minABI, fswapAddress);
      const fswapBal = await fswapContract.methods.balanceOf(account).call();
      const roundedFBal = Number((parseFloat(fswapBal) / 10 ** 18).toFixed(5));
      getBalances(roundedBBal, roundedFBal);
    }
  }

  useEffect(() => {
    (async function () {
      if (account !== "") {
        await canClaim();
        // const period = await getClaimPeriods(account);
        // setClaimPeriod(period);
      }
    })();
  }, [account]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      //   const bal = await fswapContractInst.methods.balanceOf(saleAddress).call();
      const amntBought = await saleContractInst.methods
        .tokenAmountBought()
        .call();
      //   const roundedBal = Number((parseFloat(bal) / 10 ** 18).toFixed(5));
      const roundedBought = Number(
        (parseFloat(amntBought) / 10 ** 18).toFixed(5)
      );
      console.info("roundedBought: ", roundedBought);
      console.info("remaininig: ", amountForPresale - roundedBought);
      //5164025.
      setAmountBought(roundedBought);
      setAmountRemaining(amountForPresale - roundedBought);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [amountForPresale]);

  function handleChange(e) {
    setBtaAmt(e.target.value);
  }

  const chartColors = ["#01c55d", "#0878d7"];

  const Options = {
    legend: {
      display: true,
      position: "right",
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
    animations: {
      tension: {
        duration: 1500,
        easing: "linear",
        from: 1,
        to: 0,
        loop: true,
      },
    },
    cutoutPercentage: 20,
  };

  const data = {
    maintainAspectRatio: false,
    responsive: true,
    labels: ["Token Sold", "Token Remaining"],
    datasets: [
      {
        fill: false,
        data: [amountBought, amountRemaining],
        backgroundColor: chartColors,
        hoverBackgroundColor: chartColors,
        fontColor: "#fff",
      },
    ],
  };

  // Toast options
  const tOptions = {
    error: {
      style: {
        background: "#ff1a1a",
        color: "#ffffff",
        paddingRight: "30px",
        paddingLeft: "30px",
        fontWeight: "500",
        fontSize: "18px",
      },
    },
  };
  const percentage = 67;

  return (
    <section
      className="section-scroll new-wave-section roadmap-section customise-section"
      id="roadmap"
    >
      <div className="container claim-container">
        {account !== "" ? (
          <div className="row" style={{ width: "100%" }}>
            {canUserClaim && (
              <div className="col-xl-12 claim-btn-container">
                <button
                  // disabled={!(claimPeriod > 0) || isClaimLoading}
                  disabled={isClaimLoading}
                  onClick={claimToken}
                  className="btn btn-outline-success btn-main btn-buy"
                >
                  {isClaimLoading ? (
                    <img
                      className="spinner-claim-img"
                      alt="Spinner"
                      src="./image/spinner.gif"
                    ></img>
                  ) : (
                    <span style={{ color: "#ffffff" }}>Claim</span>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="row claim-text" style={{ width: "100%" }}>
            <p>Buy And Claim MIGO Tokens</p>
          </div>
        )}
      </div>

      <div className="container customise-container">
        <div className="row customise-row">
          {amountRemaining > 0 && (
            <div className="col-md-4 col-lg-4 col-xl-4 chart-box">
              {/* <Doughnut data={data} options={Options} /> */}
              <CircularProgressbar
                value={(amountBought * 100) / amountForPresale}
                text={`${((amountBought * 100) / amountForPresale).toFixed(
                  3
                )}%`}
              />
            </div>
          )}
          <div className="min-max_desktop">
            1 CORE minimum || 10000 CORE maximum
          </div>
          <div className="min-max_mobile">
            <p>1 CORE minimum</p>
            <p>10000 CORE maximum</p>
          </div>
          <div className="rate-figure">1 CORE : 250 MIGO</div>

          <div className="col-md-8 col-lg-8 col-xl-8">
            <div className="box-roadmap customise-purchase" data-aos="fade-up">
              <h5 className="purchase-title">Partake in MIGO token sale</h5>

              <input
                className="form-control"
                onChange={handleChange}
                value={btaAmt}
                placeholder="Enter CORE amount"
              />
              <button
                disabled={isLoading}
                onClick={buyPresale}
                className="btn btn-outline-success btn-main btn-buy"
              >
                {isLoading ? (
                  <img
                    className="spinner-img"
                    alt="Spinner"
                    src="./image/spinner.gif"
                  ></img>
                ) : (
                  " Buy MIGO"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Purchase;
