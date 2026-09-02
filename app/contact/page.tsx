import ContactForm from "@/components/ContactForm";
import { getSettings } from "@/lib/settings";
import { getDir } from "@/lib/text-direction";

const defaults = {
  contact_title: "Contact",
  contact_description: "For project inquiries, collaboration, or any question, fill out the form below.",
  contact_label_name: "Your name",
  contact_label_email: "Email",
  contact_label_message: "Your message",
  contact_button_text: "Send message",
  contact_button_sending_text: "Sending...",
  contact_success_message: "Your message has been sent successfully.",
  contact_error_message: "Something went wrong, please try again.",
};

export default async function ContactPage() {
  const s = await getSettings(Object.keys(defaults), defaults);

  return (
    <div className="min-h-dvh pt-32 pb-24 px-6 md:px-16 max-w-xl mx-auto flex flex-col gap-10">
      <h1 dir={getDir(s.contact_title)} className="text-3xl md:text-5xl font-bold">
        {s.contact_title}
      </h1>
      <p dir={getDir(s.contact_description)} className="text-white/60">
        {s.contact_description}
      </p>
      <ContactForm
        labels={{
          nameLabel: s.contact_label_name,
          emailLabel: s.contact_label_email,
          messageLabel: s.contact_label_message,
          buttonText: s.contact_button_text,
          buttonSendingText: s.contact_button_sending_text,
          successMessage: s.contact_success_message,
          errorMessage: s.contact_error_message,
        }}
      />
    </div>
  );
}
