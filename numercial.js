var	tol = 1e-2, precision = 4;

class Equation
{
	constructor(rawEq, symbol = 'x')
	{
		this.symbol = symbol;
		this.e = rawEq;
		this.e = this.e.toLowerCase();
		this.e = this.rep('\\^', '**');
		this.prependMath();
		// console.log(this.e);
	}

	rep(p, q)
	{
		return this.e.replace(new RegExp(p, 'g'), q);
	}

	prependMath()
	{
		var fnlist = Object.getOwnPropertyNames(Math);
		for(var f of fnlist)
			this.e = this.rep(f, "Math." + f);
	}

	f(x)
	{
		return Number(eval(this.rep(this.symbol, x)).toFixed(precision));
	}
}


class NumericalMethod
{
	static bisect(eq, a, b)
	{
		var eq = new Equation(eq), a = Number(a) , b = Number(b);
		var t = [], c, prev_c, cdiff;
		do
		{
			c = Number(((a + b) / 2.0).toFixed(precision));
			cdiff = Math.abs(c - prev_c) <= tol;
			t.push([a, b, c, eq.f(a), eq.f(b), eq.f(c), Math.abs(eq.f(c)) <= tol ? "YES" : "NO", prev_c ? (cdiff ? "YES" : "NO") : '\u{2212}']);
			prev_c = c;

			if(eq.f(a) * eq.f(c) > 0)
				a = c;
			else
				b = c;

		}while(Math.abs(eq.f(c)) > tol && !cdiff);

		return {'table' : t, 'root' : c};
	}

	static secant(eq, a, b) // may diverge, break at 1e2 iterations 
	{
		var eq = new Equation(eq),
			a = Number(a) , b = Number(b), c,
			t = [], cdiff, iterations = 0;
		do
		{
			c = Number(( b - ((eq.f(b) * (b - a)) / (eq.f(b) - eq.f(a)))).toFixed(precision));
			t.push([a, b, c, eq.f(a), eq.f(b), eq.f(c), Math.abs(eq.f(c)) <= tol ? "YES" : "NO", '\u{2212}']);

			a = b;
			b = c;

		}while(Math.abs(eq.f(c)) > tol && iterations++ < 1e2);

		return {'table' : t, 'root' : c};
	}

	static mod_secant(eq, a, b)
	{
		var eq = new Equation(eq),
			a = Number(a) , b = Number(b), c,
			t = [];
		do
		{
			c = Number(( b - ((eq.f(b) * (b - a)) / (eq.f(b) - eq.f(a)))).toFixed(precision));
			t.push([a, b, c, eq.f(a), eq.f(b), eq.f(c), Math.abs(eq.f(c)) <= tol ? "YES" : "NO", '\u{2212}']);

			
			if(eq.f(a) * eq.f(c) > 0)
				a = c;
			else
				b = c;

		}while(Math.abs(eq.f(c)) > tol);

		return {'table' : t, 'root' : c};
	}
}


function calc()
{
	precision = Number(slide_precision.value);
	tol = eval(10 **-slide_tol.value);

	method = Array.from(document.getElementsByName('method')).filter(x => x.checked)[0].value; //iterate over radio buttons

	result = NumericalMethod[method](in_eq.value, eq_start.value, eq_end.value);
	out_ans.innerText = result['root'];
	printtab(result['table']);
}

function printtab(tab)
{
	
	// cleartab()
	l = itable.rows.length;
	while(--l) itable.deleteRow(l);

	for(row of tab)
	{
		r = itable.insertRow();
		c = r.insertCell();
		c.innerText = itable.rows.length - 1;
		c.className = 'itCount';
		for(c of row)
			r.insertCell().innerText = c;
	}
}