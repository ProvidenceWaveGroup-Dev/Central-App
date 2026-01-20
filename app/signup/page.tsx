import SignUpForm from "@/components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#DADADA] px-6 py-10 text-[#59595B]">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <SignUpForm />
      </div>
    </div>
  );
}
