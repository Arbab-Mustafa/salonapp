import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import mongoose from "mongoose";

// GET all customers
export async function GET() {
  try {
    console.log("MONGODB_URI:", process.env.MONGODB_URI);
    await connectToDatabase();
    console.log("Connected to DB:", mongoose.connection.name);

    const customers = await Customer.find().sort({ createdAt: -1 });
    console.log(`Found ${customers.length} customers`);
    return NextResponse.json(customers);
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

// POST new customer
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Customer name is required" },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (email && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const customer = await Customer.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || undefined, // Only save if not empty
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(customer);
  } catch (error: any) {
    console.error("Error creating customer:", error);
    
    // Handle duplicate email error
    if (error.code === 11000 && error.keyPattern?.email) {
      return NextResponse.json(
        { error: "A customer with this email already exists" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
