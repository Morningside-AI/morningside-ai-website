import { NextResponse } from "next/server";

// Define the structure of the expected form data
interface FormData {
  name: string;
  email: string;
  role: string;
  company_name: string;
  company_website: string;
  company_size: string;
  companys_revenue: string;
  project_budget: string;
  services_needed: string;
  message: string;
  count: number;
  firstName: string;
}

export async function POST(request: Request) {
  try {
    // Type assertion here: assert the response of `request.json()` is of type `FormData`
    const formData = (await request.json()) as FormData;

    const response = await fetch(
      "https://hook.eu2.make.com/4f3im7u1wpj0hxy5y2gind6wgopjqdq8",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Submission failed" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Form submitted successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in form submission:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
