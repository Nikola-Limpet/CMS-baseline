"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export function ToastDemo() {
  const showSuccessToast = () => {
    toast.success("Student registered successfully!", {
      description: "Welcome to CMS. Check your email for course details.",
      duration: 5000,
    })
  }

  const showInfoToast = () => {
    toast.info("New competition announcement", {
      description: "Math Olympiad 2024 registration is now open. Limited seats available.",
      duration: 4000,
    })
  }

  const showWarningToast = () => {
    toast.warning("Assignment deadline approaching", {
      description: "Your homework is due in 2 hours. Please submit before the deadline.",
      duration: 6000,
    })
  }

  const showErrorToast = () => {
    toast.error("Failed to save progress", {
      description: "Please check your internet connection and try again.",
      duration: 6000,
    })
  }

  const showLoadingToast = () => {
    const loadingToastId = toast.loading("Uploading assignment...", {
      description: "Please wait while we process your submission.",
    })

    // Simulate async operation
    setTimeout(() => {
      toast.dismiss(loadingToastId)
      toast.success("Assignment uploaded successfully!", {
        description: "Your teacher will review it within 24 hours.",
      })
    }, 3000)
  }

  const showPromiseToast = () => {
    const mockAsyncOperation = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.5) {
            resolve({ studentName: "John Doe", grade: "A+" })
          } else {
            reject(new Error("Network timeout"))
          }
        }, 2000)
      })
    }

    toast.promise(mockAsyncOperation(), {
      loading: "Grading assignment...",
      success: (data: any) => `Grade assigned: ${data.grade} for ${data.studentName}`,
      error: (error) => `Grading failed: ${error.message}`,
    })
  }

  const showWithActions = () => {
    toast.info("New course available: Advanced Calculus", {
      description: "Would you like to enroll now?",
      action: {
        label: "Enroll",
        onClick: () => {
          toast.success("Enrollment request submitted!")
        }
      },
      duration: 8000,
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Enhanced Toast Notifications
        </CardTitle>
        <CardDescription className="text-center">
          Click the buttons below to see different toast variants in action
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={showSuccessToast}
            variant="default"
            className="bg-success-500 hover:bg-success-600 text-white"
          >
            Success Toast
          </Button>
          
          <Button 
            onClick={showInfoToast}
            variant="default"
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            Info Toast
          </Button>
          
          <Button 
            onClick={showWarningToast}
            variant="default"
            className="bg-warning-500 hover:bg-warning-600 text-white"
          >
            Warning Toast
          </Button>
          
          <Button 
            onClick={showErrorToast}
            variant="default"
            className="bg-danger-500 hover:bg-danger-600 text-white"
          >
            Error Toast
          </Button>
          
          <Button 
            onClick={showLoadingToast}
            variant="outline"
          >
            Loading Toast
          </Button>
          
          <Button 
            onClick={showPromiseToast}
            variant="outline"
          >
            Promise Toast
          </Button>
        </div>
        
        <div className="pt-4 border-t">
          <Button 
            onClick={showWithActions}
            variant="secondary"
            className="w-full"
          >
            Toast with Action Button
          </Button>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-2">Usage Examples:</h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded">
              toast.success("Success message", &#123; description: "Optional description" &#125;)
            </code>
            <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded">
              toast.error("Error message", &#123; duration: 6000 &#125;)
            </code>
            <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded">
              toast.promise(asyncFunction(), &#123; loading: "Loading...", success: "Done!", error: "Failed!" &#125;)
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 