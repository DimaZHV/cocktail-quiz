import React, { useState, useEffect } from "react";
import { cocktails, allIngredients } from "./cocktails";

function shuffleArray(arr) {
	return [...arr].sort(() => Math.random() - 0.5);
}

function getRandomIngredients(exclude, count) {
	const filtered = allIngredients.filter((i) => !exclude.includes(i));
	return shuffleArray(filtered)
		.slice(0, count)
		.map((name) => ({ name, amount: null }));
}

function App() {
	const [currentCocktailIndex, setCurrentCocktailIndex] = useState(
		Math.floor(Math.random() * cocktails.length)
	);
	const [mixedIngredients, setMixedIngredients] = useState([]);
	const [userInput, setUserInput] = useState({});
	const [result, setResult] = useState(null);

	const currentCocktail = cocktails[currentCocktailIndex];

	const resetState = () => {
		const correctIngredients = currentCocktail.ingredients;
		const randoms = getRandomIngredients(
			correctIngredients.map((i) => i.name),
			5
		);
		const all = shuffleArray([...correctIngredients, ...randoms]);
		setMixedIngredients(all);
		setUserInput({});
		setResult(null);
	};

	useEffect(() => {
		resetState();
	}, [currentCocktailIndex]);

	const handleChange = (name, value) => {
		setUserInput({ ...userInput, [name]: value });
	};

	const checkAnswers = () => {
		const correctMap = Object.fromEntries(
			currentCocktail.ingredients.map((i) => [i.name, i.amount])
		);
		const userKeys = Object.keys(userInput);

		const allCorrect = Object.entries(correctMap).every(([name, amount]) => {
			const userValue = userInput[name];

			if (amount === "так") return userValue === "так";
			if (Array.isArray(amount)) return amount.includes(Number(userValue));
			return Number(userValue) === amount;
		});

		const noExtra = userKeys.every((key) => correctMap[key] !== undefined);
		setResult(allCorrect && noExtra ? "correct" : "incorrect");
	};

	const nextCocktail = () => {
		let nextIndex;
		do {
			nextIndex = Math.floor(Math.random() * cocktails.length);
		} while (nextIndex === currentCocktailIndex);
		setCurrentCocktailIndex(nextIndex);
	};

	return (
		<div style={{ padding: 20, fontFamily: "Arial" }}>
			<h1>{currentCocktail.name}</h1>
			<form onSubmit={(e) => e.preventDefault()}>
				{mixedIngredients.map((ingredient, index) => (
					<div key={index} style={{ marginBottom: 8 }}>
						<label>
							{ingredient.name}:&nbsp;
							{ingredient.amount === "так" ? (
								<select
									value={userInput[ingredient.name] || ""}
									onChange={(e) =>
										handleChange(ingredient.name, e.target.value)
									}
									disabled={result !== null}
								>
									<option value="">—</option>
									<option value="так">так</option>
									<option value="ні">ні</option>
								</select>
							) : (
								<input
									type="number"
									value={userInput[ingredient.name] || ""}
									onChange={(e) =>
										handleChange(ingredient.name, e.target.value)
									}
									disabled={result !== null}
								/>
							)}
						</label>
					</div>
				))}

				{result === null ? (
					<button onClick={checkAnswers} style={{ marginTop: 10 }}>
						Перевірити
					</button>
				) : (
					<div style={{ marginTop: 20 }}>
						<h3 style={{ color: result === "correct" ? "green" : "red" }}>
							{result === "correct" ? "✅ Правильно!" : "❌ Не правильно"}
						</h3>

						{result === "incorrect" && (
							<div>
								<h4>Правильні інгредієнти:</h4>
								<ul>
									{currentCocktail.ingredients.map((i, idx) => (
										<li key={idx}>
											{i.name}:{" "}
											{Array.isArray(i.amount)
												? `${Math.min(...i.amount)}–${Math.max(...i.amount)} г`
												: i.amount === "так"
												? "так"
												: `${i.amount} г`}
										</li>
									))}
								</ul>
							</div>
						)}

						<button onClick={nextCocktail} style={{ marginTop: 10 }}>
							Наступний коктейль
						</button>
					</div>
				)}
			</form>
		</div>
	);
}

export default App;
