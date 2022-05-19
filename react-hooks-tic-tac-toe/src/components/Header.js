import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
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
  CREATE_GAME,
  JOIN_GAME,
  GAME_BASE,
  HOME_PAGE,
  POLLING_INTERVAL,
} from "../constant";
import useInterval from "../hooks/useInterval";

import { useKeplr } from "../useKeplr";
import { convertAcudosToCudos } from "../utils";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { connectWallet, account, provider } = useKeplr();
  const [balance, setBalance] = useState();
  const getBalance = async () => {
    const bal = await provider.getBalance(account, "acudos");
    setBalance(convertAcudosToCudos(bal.amount));
  };

  const history = useHistory();

  const toggle = () => setIsOpen(!isOpen);
  useEffect(() => {
    if (!account || !provider) return;
    getBalance();
  }, [account, provider]);

  useInterval(getBalance, !!balance ? POLLING_INTERVAL * 1000 : null);

  return (
    <div className="mb-3">
      <Navbar color="light" light expand="md">
        <NavbarBrand href={HOME_PAGE}>Cudos</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="m-auto" navbar>
            <NavItem>
              <Button
                color="transparent"
                tag={NavLink}
                onClick={() => history.push(CREATE_GAME)}
              >
                Create Game
              </Button>
            </NavItem>
            <NavItem>
              <Button
                color="transparent"
                tag={NavLink}
                onClick={() => history.push(JOIN_GAME)}
              >
                Join Game
              </Button>
            </NavItem>
            <NavItem>
              <Button
                color="transparent"
                tag={NavLink}
                onClick={() => history.push(GAME_BASE)}
              >
                View Game
              </Button>
            </NavItem>
          </Nav>
        </Collapse>
        <Label className="mx-3">{balance > 0 ? balance + "cudos" : null}</Label>
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
