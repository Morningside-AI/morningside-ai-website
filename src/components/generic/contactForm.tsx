/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  type FormikHelpers,
  type FormikProps,
} from "formik";
import * as Yup from "yup";
import { IoMdAlert } from "react-icons/io";
import { PiArrowsClockwise } from "react-icons/pi";

interface FormValues {
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
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  role: Yup.string()
    .min(2, "Role must be at least 2 characters")
    .required("Required"),
  company_name: Yup.string()
    .min(2, "Company name must be at least 2 characters")
    .required("Required"),
  company_website: Yup.string()
    .min(2, "Company website must be at least 2 characters")
    .url("Enter a valid URL (e.g. https://example.com)")
    .required("Required"),
  company_size: Yup.string().required("Required"),
  companys_revenue: Yup.string().required("Required"),
  project_budget: Yup.string().required("Required"),
  services_needed: Yup.string().required("Required"),
  message: Yup.string()
    .min(2, "Message must be at least 2 characters")
    .required("Required"),
});

const ContactForm = ({
  setSuccess,
}: {
  setSuccess: (val: boolean) => void;
}) => (
  <Formik<FormValues>
    initialValues={{
      name: "",
      email: "",
      role: "",
      company_name: "",
      company_website: "",
      company_size: "",
      companys_revenue: "",
      project_budget: "",
      services_needed: "",
      message: "",
    }}
    validationSchema={validationSchema}
    onSubmit={async (values, { resetForm }: FormikHelpers<FormValues>) => {
      try {
        const currentCount = Number(
          localStorage.getItem("form_submit_count") ?? "0",
        );
        const newCount = currentCount + 1;
        localStorage.setItem("form_submit_count", newCount.toString());

        const firstName = values.name.trim().split(" ")[0];

        const payloadWithCount = {
          ...values,
          count: newCount,
          firstName,
        };

        await fetch("/api/sendFormData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadWithCount),
        });
        console.log("Form submitted successfully!");
        setSuccess(true);
        resetForm();
      } catch (err) {
        console.error(err);
      }
    }}
  >
    {({ isSubmitting }: FormikProps<FormValues>) => (
      <Form className="flex h-full w-full flex-col gap-[1rem] pr-1 md:pr-0">
        {/* Name */}
        <div className="mb-4 flex w-full flex-col gap-2 lg:flex-row">
          <div className="flex w-full flex-col gap-2 lg:w-1/2">
            <Label name="What is your name?" field="name" />
            <Field
              type="text"
              name="name"
              placeholder="Name"
              className="border"
            />
            <Error name="name" />
          </div>
          {/* Email */}
          <div className="flex w-full flex-col gap-2 lg:w-1/2">
            <Label name="What is your email?" field="email" />
            <Field
              type="email"
              name="email"
              placeholder="Email"
              className="border"
            />
            <Error name="email" />
          </div>
        </div>

        {/* Role */}
        <div className="mb-4 flex w-full flex-col gap-2">
          <Label name="What is your role in the company?" field="role" />
          <Field
            type="text"
            name="role"
            placeholder="Enter role"
            className="border"
          />
          <Error name="role" />
        </div>

        {/* Company Name & Website */}
        <div className="mb-4 flex w-full flex-col gap-2 lg:flex-row">
          <div className="flex w-full flex-col gap-2 lg:w-1/2">
            <Label name="Company Name" field="company_name" />
            <Field
              type="text"
              name="company_name"
              placeholder="Enter company name"
              className="border"
            />
            <Error name="company_name" />
          </div>
          <div className="flex w-full flex-col gap-2 lg:w-1/2">
            <Label name="Company Website" field="company_website" />
            <Field
              type="url"
              name="company_website"
              placeholder="Enter company website"
              className="border"
            />
            <Error name="company_website" />
          </div>
        </div>

        {/* Company Size & Revenue */}
        <div className="mb-4 flex w-full flex-col gap-2 lg:flex-row">
          <div className="flex w-full flex-col gap-2 lg:w-1/2">
            <Label name="Company Size" field="company_size" />
            <Field as="select" name="company_size" className="border">
              <option value="">Select company size</option>
              <option value="1-20">Less than 20</option>
              <option value="20-50">20-50</option>
              <option value="50-100">50-100</option>
              <option value="100-500">100-500</option>
              <option value="500-1000">More than 500</option>
            </Field>
            <Error name="company_size" />
          </div>
          <div className="flex w-full flex-col gap-2 lg:w-1/2">
            <Label name="Company's Annual Revenue" field="companys_revenue" />
            <Field as="select" name="companys_revenue" className="border">
              <option value="">Select revenue range</option>
              <option value="<100K">Less than $100K</option>
              <option value="100K-500K">$100K-$500K</option>
              <option value="500K-1M">$500K-$1M</option>
              <option value="1M-2M">$1M-$2M</option>
              <option value=">2M">More than $2M</option>
            </Field>
            <Error name="companys_revenue" />
          </div>
        </div>

        {/* Project Budget */}
        <div className="mb-4 flex w-full flex-col gap-2">
          <Label name="Project budget" field="project_budget" />
          <Field as="select" name="project_budget" className="border">
            <option value="">Select budget range</option>
            <option value="Less than $10K">Less than $10K</option>
            <option value="$10K-$50K">$10K-$50K</option>
            <option value="$50K-$100K">$50K-$100K</option>
            <option value="More than $100K">More than $100K</option>
          </Field>
          <Error name="project_budget" />
        </div>

        {/* Services Needed */}
        <div className="mb-4 flex w-full flex-col gap-2">
          <Label
            name="What services are you interested in?"
            field="services_needed"
          />
          <Field as="select" name="services_needed" className="border">
            <option value="">Select service</option>
            <option value="Identifying">Identifying AI opportunities</option>
            <option value="Educating">Educating your team on AI</option>
            <option value="Developing">Developing custom AI solutions</option>
          </Field>
          <Error name="services_needed" />
        </div>

        {/* Message */}
        <div className="mb-4 flex w-full flex-col gap-2">
          <Label name="Message" field="message" />
          <Field
            as="textarea"
            rows={7}
            name="message"
            placeholder="Enter message"
            className="resize-none border"
          />
          <Error name="message" />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-fit cursor-pointer rounded-full border border-black px-4 py-2 text-black ${isSubmitting ? "opacity-50" : ""}`}
        >
          {isSubmitting ? (
            <div className="flex flex-row items-center gap-2">
              <PiArrowsClockwise size={16} className="animate-spin" />
              Sending...
            </div>
          ) : (
            "Send inquiry"
          )}
        </button>
      </Form>
    )}
  </Formik>
);

// Helper components
const Label = ({ name, field }: { name: string; field: string }) => (
  <div className="flex flex-row items-center gap-1">
    <p className="text-md font-medium">{name}</p>
    <ErrorMessage
      name={field}
      component={() => <IoMdAlert size={14} color="red" />}
    />
  </div>
);

const Error = ({ name }: { name: string }) => (
  <ErrorMessage name={name} component="div" className="text-xs text-red-500" />
);

export default ContactForm;
