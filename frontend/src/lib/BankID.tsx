import { Linking } from "react-native";
import Button from "../components/Button";

const BankID = () => {
  return (
    <Button
      title="Öppna BankId på denna enhet"
      onPress={() =>
        Linking.openURL("https://app.bankid.com/?autostarttoken=&redirect=null")
      }
    />
  );
};

export default BankID;
