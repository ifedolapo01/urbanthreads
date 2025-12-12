// test-simple.js
async function testAPI() {
  console.log('Testing Order API...');
  
  const response = await fetch('http://localhost:3001/api/send-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderNumber: "TEST" + Date.now().toString().slice(-6),
      customerName: "Ajayi Ifedolapo",
      customerEmail: "harjayeifedolinx@gmail.com", // Use a test email
      customerPhone: "08012345678",
      total: 25000,
      deliveryOption: "pickup",
      selectedState: "Abuja",
      items: [
        { name: "Test T-Shirt", price: 8500, quantity: 1, size: "M", color: "Black" }
      ],
      pickupAddress: "Suite 5, XYZ Plaza, Central Business District, Abuja",
      note: "Test order from API",
      timestamp: new Date().toISOString()
    })
  });
  
  const result = await response.json();
  console.log('Result:', result);
}

testAPI().catch(console.error);