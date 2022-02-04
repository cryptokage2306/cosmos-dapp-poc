import { calculateFee, coins } from "@cosmjs/stargate";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";
import { useKeplr } from "../../useKeplr";

export const Send = () => {
  const { register, handleSubmit } = useForm();

  const { provider, account } = useKeplr();
  const onSubmit = async ({
    address,
    amount,
  }: {
    address: string;
    amount: number;
  }) => {
    try {
      const tx = await provider?.sendTokens(
        account,
        address,
        coins(amount, "acudos"),
        calculateFee(80000, "0.01acudos")
      );
      console.log(tx);
      toast.success(tx?.transactionHash);
    } catch (err) {
      toast.error(err?.message);
    }
  };
  return (
    <>
      <Row>
        <h1 className="text-center">Send</h1>
        <Col xs={12} md="6">
          <div className="my-2">
            <h2>What is send transaction</h2>
            <section>
              Sending tokens to single address at the same time in just one
              transaction
            </section>
          </div>
          <div className="my-2">
            <h2>How to do send transaction?</h2>
            <section>
              <ol>
                <li>
                  Add address of recipient and number of cudos tokens sender
                  wants to send
                </li>
                <small>
                  Make sure you have enough balance to carry out transaction
                </small>
              </ol>
            </section>
          </div>
        </Col>
        <Col className="text-center m-auto" xs={12} md="6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-2">
              <input
                className="mx-3"
                placeholder="Address"
                {...register(`address`)}
              />
              <input
                className="mx-3"
                placeholder="Amount in Cudos"
                type="number"
                {...register(`amount`, {
                  min: 0,
                  valueAsNumber: true,
                })}
              />
              <label>Cudos</label>
            </div>
            <input type="submit" />
          </form>
        </Col>
      </Row>
    </>
  );
};
