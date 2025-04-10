export function Footer() {
    return (
        <footer className="py-6 bg-gray-50 border-t">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md"></div>
              <span className="font-medium">Lumen Billing</span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Lumen Billing. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    )
}