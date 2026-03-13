import { useState } from "react";

export default function LeadForm() {

const [email,setEmail] = useState("");

async function submitLead(){

await fetch("http://localhost:8000/lead",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body: JSON.stringify({email})
});

alert("Thanks! We'll contact you soon.");
}

return(

<div style={{padding:"40px"}}>

<h2>Get a Free AI Strategy Plan</h2>

<input
type="email"
placeholder="Enter your email"
onChange={(e)=>setEmail(e.target.value)}
/>

<button onClick={submitLead}>
Get Plan
</button>

</div>

)

}