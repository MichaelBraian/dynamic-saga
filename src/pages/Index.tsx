import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <img
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
            alt="Person working on laptop"
            className="object-cover w-full h-full brightness-50"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 md:p-8">
            <h1 className="text-3xl md:text-5xl font-bold text-center mb-4">
              Welcome to DynamicSaga
            </h1>
            <p className="text-lg md:text-xl text-center max-w-2xl mx-auto mb-8">
              Your journey into a world of endless possibilities begins here
            </p>
          </div>
        </AspectRatio>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/90 backdrop-blur">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Discover</h3>
              <p className="text-muted-foreground">
                Explore unique stories and adventures
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Create</h3>
              <p className="text-muted-foreground">
                Shape your own narrative journey
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-muted-foreground">
                Join a community of storytellers
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;