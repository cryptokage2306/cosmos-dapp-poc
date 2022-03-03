import { useEffect, useState } from "react";
import { calculateFee, coins } from "@cosmjs/stargate";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { Button, ButtonGroup, Row, Col } from "reactstrap";

import { useKeplr } from "../../useKeplr";

export function MultiSend() {
  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      multiSend: [{ address: "", amount: 0 }],
    },
  });
  const [selectedFile, setSelectedFile] =
    useState<{ address: string; amount: number }[]>();
  const [isReadable, setIsReadable] = useState(false);
  const watchMultisend = watch("multiSend");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "multiSend",
  });
  const { provider, account } = useKeplr();

  const sum = watchMultisend.reduce((acc, prev) => (acc += prev.amount), 0);

  const onSubmit = async ({ multiSend }: { multiSend: any[] }) => {
    try {
      const msg = {
        typeUrl: "/cosmos.bank.v1beta1.MsgMultiSend",
        value: {
          inputs: [
            {
              address: account,
              coins: coins(sum * 10 ** 18, "acudos"),
            },
          ],
          outputs: multiSend.map((item) => ({
            coins: coins(item.amount * 10 ** 18, "acudos"),
            address: item.address,
          })),
        },
      };
      const tx = await provider?.signAndBroadcast(
        account,
        [msg],
        calculateFee(160000, "0.01acudos")
      );
      console.log(tx);
      toast.success(tx?.transactionHash, {
        autoClose: false,
      });
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    }
  };

  function onChange(event) {
    const reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
  }

  function onReaderLoad(event) {
    try {
      const obj = JSON.parse(event.target.result);
      if (Array.isArray(obj)) {
        const targets: { address: string; amount: number }[] = [];
        obj.forEach((item) => {
          if (!item.address || !item.amount)
            throw new Error("Address or amount is not present, please select different file");
          targets.push({
            address: item.address,
            amount: item.amount,
          });
        });
        setSelectedFile(targets);
        return;
      }
      throw new Error("Cannot be parsed, please select different file");
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    }
  }

  useEffect(() => {
    if (!selectedFile?.length) return;
    fields.forEach((_, i) => remove(i));
    selectedFile.forEach((item) => append(item));
    setIsReadable(true);
  }, [selectedFile]);


  return (
    <>
      <Row>
        <h1 className="text-center">Multi Send</h1>
        <Col xs={12} md="6">
          <div className="my-2">
            <h2>What is multi-send transaction</h2>
            <section>
              Sending tokens to multiple addresses at the same time in just one
              transaction
            </section>
          </div>
          <div className="my-2">
            <h2>How to do multi-send transaction</h2>
            <section>
              <ol>
                <li>
                  Add address of recipient and number of cudos tokens sender
                  wants to send
                </li>
                <small>
                  Make sure you have enough balance to carry out transaction
                </small>
                <li>
                  If you want to add more than 1 receiving address click on +/-
                  button present above to increase or decrease number of sender
                </li>
              </ol>
            </section>
          </div>
        </Col>
        <Col className="text-center m-auto" xs={12} md="6">
          <input
            type={"file"}
            accept={".json"}
            onChange={onChange}
          />
          <ButtonGroup>
            <Button
              color="primary"
              disabled={isReadable}
              onClick={() => append({ address: "", amount: 0 })}
            >
              +
            </Button>
            <Button
              color="danger"
              disabled={fields.length === 1 || isReadable}
              onClick={() => remove(fields.length - 1)}
            >
              -
            </Button>
            {isReadable && <Button onClick={() => setIsReadable(false)}>
              Edit
            </Button>}
          </ButtonGroup>
          <h3>Total Amount: {sum} cudos</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((item, index) => {
              return (
                <div key={item.id} className="my-2">
                  <input
                    className="mx-3"
                    placeholder="Address"
                    {...register(`multiSend.${index}.address`)}
                    disabled={isReadable}
                  />
                  <input
                    className="mx-3"
                    placeholder="Amount in Cudos"
                    type="number"
                    {...register(`multiSend.${index}.amount`, {
                      min: 0,
                      valueAsNumber: true,
                    })}
                    disabled={isReadable}
                  />
                  <label>Cudos</label>
                </div>
              );
            })}
            <input type="submit" />
          </form>
        </Col>
      </Row>
    </>
  );
}
