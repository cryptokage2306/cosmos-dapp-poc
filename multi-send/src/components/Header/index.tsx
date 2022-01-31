import { useEffect, useState } from "react";
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
  HOME_PAGE,
  MULTI_SEND_BASE_PAGE,
  SEND_BASE_PAGE,
} from "../../constant";

import { useKeplr } from "../../useKeplr";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { connectWallet, account, provider } = useKeplr();
  const [balance, setBalance] = useState<any>();
  const getBalance = async () => {
    const bal = await provider?.getBalance(account, "acudos");
    setBalance(bal?.amount / 10 ** 18);
  };

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
            <NavItem>
              <NavLink href={SEND_BASE_PAGE}>Send</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href={MULTI_SEND_BASE_PAGE}>MultiSend</NavLink>
            </NavItem>
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
