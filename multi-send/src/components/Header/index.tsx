import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  Label,
} from "reactstrap";
import {
  ALL_NFT_PAGE,
  HOME_PAGE,
  MULTI_SEND,
  MULTI_SEND_BASE_PAGE,
  NFT_BASE_PAGE,
  NFT_BINDING,
  NFT_WRITE_PAGE,
  SEND_BASE_PAGE,
  SHOW_ALL_NFT,
  SHOW_ALL_NFT_TIC_TAC_INTERFACE,
  TIC_TAC_BASE_PAGE,
  TIC_TAC_WRITE_PAGE,
} from "../../constant";

import { useKeplr } from "../../useKeplr";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { connectWallet, account, provider } = useKeplr();
  const [balance, setBalance] = useState<any>();
  const getBalance = async () => {
    const bal = await provider?.getBalance(account, "acudos");
    console.log(bal);
    setBalance(bal?.amount / 10 ** 18);
  };

  const navigate = useNavigate();

  const toggle = () => setIsOpen(!isOpen);
  useEffect(() => {
    if (!account || !provider) return;
    getBalance();
  }, [account, provider]);

  return (
    <div className="mb-3">
      <Navbar color="light" light expand="md">
        <NavbarBrand href={HOME_PAGE}>Cudos</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="m-auto" navbar>
            {MULTI_SEND && (
              <>
                <NavItem>
                  <Button
                    color="transparent"
                    tag={NavLink}
                    onClick={() => navigate(MULTI_SEND_BASE_PAGE)}
                  >
                    MultiSend
                  </Button>
                </NavItem>
                <NavItem>
                  <Button
                    color="transparent"
                    tag={NavLink}
                    onClick={() => navigate(SEND_BASE_PAGE)}
                  >
                    Send
                  </Button>
                </NavItem>
              </>
            )}

            {NFT_BINDING && (
              <>
                <NavItem>
                  <Button
                    color="transparent"
                    tag={NavLink}
                    onClick={() => navigate(NFT_BASE_PAGE)}
                  >
                    NFTs Read
                  </Button>
                  {/* <NavLink href={NFT_BASE_PAGE}>NFTs Read</NavLink> */}
                </NavItem>
                <NavItem>
                  <Button
                    color="transparent"
                    tag={NavLink}
                    onClick={() => navigate(NFT_WRITE_PAGE)}
                  >
                    NFT Write
                  </Button>
                </NavItem>
              </>
            )}

            {SHOW_ALL_NFT && (
              <>
                <NavItem>
                  <Button
                    color="transparent"
                    tag={NavLink}
                    onClick={() => navigate(ALL_NFT_PAGE)}
                  >
                    All NFT
                  </Button>
                </NavItem>
              </>
            )}
            {SHOW_ALL_NFT_TIC_TAC_INTERFACE && (
              <>
                <NavItem>
                  <Button
                    color="transparent"
                    tag={NavLink}
                    onClick={() => navigate(TIC_TAC_BASE_PAGE)}
                  >
                    Tic Tac Read
                  </Button>
                </NavItem>
                <NavItem>
                  <Button
                    color="transparent"
                    tag={NavLink}
                    onClick={() => navigate(TIC_TAC_WRITE_PAGE)}
                  >
                    Tic Tac Write
                  </Button>
                </NavItem>
              </>
            )}
          </Nav>
        </Collapse>
        <Label className="mx-3">
          {balance > 0 ? balance + " acudos" : null}
        </Label>
        <Button
          color="primary"
          className="truncate"
          style={{ width: "150px" }}
          onClick={connectWallet}
        >
          {account ? account : `Connect to Keplr`}
        </Button>
      </Navbar>
    </div>
  );
};
