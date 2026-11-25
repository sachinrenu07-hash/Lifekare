# Lifekare Diagnostic Lab website

A responsive diagnostic-lab website starter for Lifekare Diagnostic Lab, Chagallu.

## Included
- Responsive homepage, test catalogue, sample health packages and contact information.
- Search and category filtering for tests.
- Select multiple tests and calculate an illustrative total.
- Lab visit / home collection request form.
- Date and time-slot picker.
- Demo booking reference and downloadable text receipt.
- WhatsApp, phone, email and Google Maps links.

## Run locally
No build tools are required:
1. Extract the ZIP.
2. Open `index.html` in a modern browser, or serve the folder with a local static server.
3. For example, run `python -m http.server 8000` in this folder and visit `http://localhost:8000`.

## Important: demo mode versus production
This package is a working **front-end demo**. Bookings are stored in the browser's `localStorage` only. They are not sent to the laboratory, are not shared between devices, and browser-based slot checking cannot prevent two people on different devices from choosing the same slot. Do not use this demo to collect or store real patient medical information.

For a real public booking system, connect a secure backend and database (for example Supabase) and enforce slot uniqueness on the server/database. Add authentication and staff-only access before storing patient records or uploading reports. Use a compliant payment provider such as Razorpay for verified UPI payments; never collect UPI PINs or card details in this website. Cash can be recorded as a payment preference, not as proof of payment.

## Production setup checklist
1. Create a Supabase project.
2. Create database tables for tests, bookings, time slots, patients and report metadata.
3. Add a server-side booking function / Edge Function that checks slot availability and inserts a booking in one transaction.
4. Add a unique database constraint for `(appointment_date, slot_id)` for active bookings.
5. Configure Row Level Security (RLS); patients must only see their own bookings/reports and staff access must be role-restricted.
6. Integrate an authenticated admin area for managing prices, availability and report uploads.
7. Configure Razorpay server-side order creation and signature verification if online payment is enabled.
8. Configure email/SMS/WhatsApp notifications with a trusted provider.
9. Publish the static frontend on Vercel or Netlify and deploy backend functions separately.
10. Verify all test prices, package details, service coverage, business hours, and legal/privacy requirements with the lab before launch.

## Business details currently configured
- Lifekare Diagnostic Lab
- Kapula Gudi D Street, Chagallu, Chagallu Mandal, East Godavari District, Andhra Pradesh – 534342, India
- Phone / WhatsApp: 9701096777
- Email: gradetastic@gmail.com
- Working hours: 6:30 AM – 9:30 PM

Prices in the catalogue and package cards are illustrative placeholders and must be verified by the laboratory.
