import { HamburgerMenu } from "@/components/HamburgerMenu";

const CreateCharacter = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <HamburgerMenu />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-['Cinzel'] text-center mb-8">Create Your Character</h1>
      </div>
    </div>
  );
};

export default CreateCharacter;