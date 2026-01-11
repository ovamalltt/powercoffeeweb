import { LoginForm } from "@/components/auth/login-form"
import { Coffee } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-card relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23d5cea3' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          {/* Logo */}
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mb-8 glow-gold">
            <Coffee className="w-10 h-10 text-primary-foreground" />
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance text-center">PowerCoffee</h1>
          <p className="text-lg text-muted-foreground text-center max-w-md text-pretty">
            Modern Coffee Shop Management System. Manage your menu, transactions, customers, and employees all in one
            place.
          </p>

          {/* Features */}
          <div className="mt-12 space-y-4 w-full max-w-sm">
            {[
              "Real-time sales dashboard",
              "Inventory & menu management",
              "Customer loyalty tracking",
              "Employee management",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4">
              <Coffee className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">PowerCoffee</h1>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}
