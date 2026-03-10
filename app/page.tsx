import { LoginForm } from "@/components/login-form"
import Image from "next/image"
import TaskCenterPage from "./task-center/page"

export default function LoginPage() {
  return (

    <TaskCenterPage />
    // <div className="min-h-screen flex flex-col">
    //   {/* Header */}
    //   <div className="w-full py-4 px-6 flex items-center" style={{ backgroundColor: "rgb(4, 53, 95)" }}>
    //     <div className="flex items-center gap-2">
    //       <div className="bg-white rounded-full p-3 flex items-center justify-center">
    //         <Image
    //           src="/images/logo.png"
    //           alt="Logo"
    //           width={32}
    //           height={32}
    //           className="h-8 w-8 object-contain"
    //         />
    //       </div>
    //       <div className="text-xl font-semibold text-white">CSO Portal</div>
    //     </div>
    //   </div>

    //   <div className="w-full bg-white" style={{ height: "0.3382in" }}></div>

    //   {/* Main Content Area */}
    //   <div
    //     className="flex-1 flex flex-col items-center justify-center p-8"
    //     style={{ backgroundColor: "rgb(237, 245, 250)" }}
    //   >
    //     <LoginForm />
    //   </div>

    //   <div className="w-full bg-white" style={{ height: "0.3382in" }}></div>
    // </div>
  )
}
