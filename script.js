const PRICE = 24.99;
const ORDER_EMAIL = "orders@example.com";
const MONZO_PAYMENT_URL = "https://monzo.com/pay/r/ignite-fitness-coaching_f6RvJFebjwKOjb";
let qty = Math.max(1, Number(localStorage.getItem("ironpulse_qty") || 1));

function money(n){ return "£" + n.toFixed(2); }
function save(){ localStorage.setItem("ironpulse_qty", String(qty)); }

function updateUI(){
  const q = document.getElementById("qty-value");
  if(q) q.textContent = qty;
  const cq = document.getElementById("checkout-qty");
  if(cq) cq.textContent = qty;
  const count = document.getElementById("cart-count");
  if(count) count.textContent = qty;
  const sub = document.getElementById("subtotal");
  const total = document.getElementById("total");
  if(sub) sub.textContent = money(PRICE * qty);
  if(total) total.textContent = money(PRICE * qty);
  const empty = document.getElementById("basket-empty");
  const filled = document.getElementById("basket-filled");
  if(empty && filled){
    empty.hidden = qty > 0 ? true : false;
    filled.hidden = qty <= 0;
  }
}

document.addEventListener("click", (e)=>{
  const btn = e.target.closest("[data-qty]");
  if(!btn) return;
  qty += Number(btn.dataset.qty);
  if(qty < 1) qty = 1;
  save(); updateUI();
});

const add = document.getElementById("add-to-cart");
if(add){
  add.addEventListener("click", ()=>{
    save(); updateUI();
    add.textContent = "Added ✓";
    setTimeout(()=>add.textContent="Add to basket", 1200);
  });
}

const form = document.getElementById("order-form");
if(form){
  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(qty < 1) return;
    const data = new FormData(form);
    const subject = encodeURIComponent("IRONPULSE order request");
    const body = encodeURIComponent(
      `New IRONPULSE order request\n\n`+
      `Product: IRONPULSE Cable Rope Attachment\n`+
      `Quantity: ${qty}\n`+
      `Total before delivery: ${money(PRICE*qty)}\n\n`+
      `Customer: ${data.get("name")}\n`+
      `Email: ${data.get("email")}\n`+
      `Phone: ${data.get("phone")}\n`+
      `Address:\n${data.get("address")}\n\n`+
      `Please contact the customer to confirm delivery and payment.`
    );
    window.open(MONZO_PAYMENT_URL, "_blank", "noopener");
  });
}
updateUI();
