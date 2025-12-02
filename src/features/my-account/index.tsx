import { AccountForm } from "./components/account-form";

const MyAccountFeature = () => {
  return (
    <div className="h-full bg-background md:bg-muted/10 overflow-y-auto">
      <AccountForm />
    </div>
  );
};

export default MyAccountFeature;