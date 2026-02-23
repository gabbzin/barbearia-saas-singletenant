import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export type payMethods = "cartao" | "pix" | "dinheiro";

interface PagamentFormProps {
  payMethod?: payMethods;
  onPaymentMethodSelect?: (method: payMethods) => void;
}

const PagamentForm = ({
  payMethod,
  onPaymentMethodSelect,
}: PagamentFormProps) => {
  return (
    <>
      <h2>Forma de pagamento</h2>
      <RadioGroup value={payMethod} onValueChange={onPaymentMethodSelect}>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="cartao" id="cartao" />
          <Label htmlFor="cartao">Cartão de Crédito ou Débito</Label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="pix" id="pix" />
          <Label htmlFor="pix">PIX</Label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="dinheiro" id="dinheiro" />
          <Label htmlFor="dinheiro">Dinheiro</Label>
        </div>
      </RadioGroup>
    </>
  );
};

export default PagamentForm;
