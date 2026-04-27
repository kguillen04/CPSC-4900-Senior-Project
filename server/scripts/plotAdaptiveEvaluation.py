import os
import glob
import pandas as pd
import matplotlib.pyplot as plt

OUTPUT_DIR = "evaluation-output"
PLOTS_DIR = os.path.join(OUTPUT_DIR, "plots")
os.makedirs(PLOTS_DIR, exist_ok=True)


def find_latest_file(pattern: str) -> str:
    matches = glob.glob(os.path.join(OUTPUT_DIR, pattern))
    if not matches:
        raise FileNotFoundError(f"No files found matching pattern: {pattern}")
    return max(matches, key=os.path.getmtime)


def save_plot(filename: str):
    path = os.path.join(PLOTS_DIR, filename)
    plt.tight_layout()
    plt.savefig(path, dpi=300, bbox_inches="tight")
    plt.close()
    print(f"Saved plot: {path}")


def plot_mastery_over_attempts(attempt_df: pd.DataFrame):
    for concept in sorted(attempt_df["concept"].unique()):
        plt.figure(figsize=(8, 5))

        concept_df = attempt_df[attempt_df["concept"] == concept].copy()

        for profile in sorted(concept_df["profile"].unique()):
            profile_df = concept_df[concept_df["profile"] == profile].sort_values("attempt")
            plt.plot(
                profile_df["attempt"],
                profile_df["newMastery"],
                marker="o",
                label=profile
            )

        plt.title(f"Mastery Over Attempts — {concept.capitalize()}")
        plt.xlabel("Attempt Number")
        plt.ylabel("Mastery Score")
        plt.ylim(0, 1)
        plt.xticks(sorted(concept_df["attempt"].unique()))
        plt.legend()
        save_plot(f"mastery_over_attempts_{concept}.png")


def plot_difficulty_over_attempts(attempt_df: pd.DataFrame):
    for concept in sorted(attempt_df["concept"].unique()):
        plt.figure(figsize=(8, 5))

        concept_df = attempt_df[attempt_df["concept"] == concept].copy()

        for profile in sorted(concept_df["profile"].unique()):
            profile_df = concept_df[concept_df["profile"] == profile].sort_values("attempt")
            plt.plot(
                profile_df["attempt"],
                profile_df["difficulty"],
                marker="o",
                label=profile
            )

        plt.title(f"Difficulty Over Attempts — {concept.capitalize()}")
        plt.xlabel("Attempt Number")
        plt.ylabel("Question Difficulty")
        plt.ylim(0.8, 5.2)
        plt.yticks([1, 2, 3, 4, 5])
        plt.xticks(sorted(concept_df["attempt"].unique()))
        plt.legend()
        save_plot(f"difficulty_over_attempts_{concept}.png")


def plot_session_metric_bars(session_df: pd.DataFrame, metric: str, ylabel: str, filename: str):
    concepts = sorted(session_df["concept"].unique())
    profiles = sorted(session_df["profile"].unique())

    fig, axes = plt.subplots(1, len(concepts), figsize=(5 * len(concepts), 5), squeeze=False)

    for i, concept in enumerate(concepts):
        ax = axes[0][i]
        concept_df = session_df[session_df["concept"] == concept].copy()
        concept_df = concept_df.set_index("profile").reindex(profiles).reset_index()

        ax.bar(concept_df["profile"], concept_df[metric])
        ax.set_title(concept.capitalize())
        ax.set_ylabel(ylabel)
        ax.set_xlabel("Learner Profile")

        if metric in {"accuracy"}:
            ax.set_ylim(0, 1)
        if metric in {"startingMastery", "endingMastery"}:
            ax.set_ylim(0, 1)

    plt.suptitle(filename.replace("_", " ").replace(".png", "").title(), y=1.03)
    save_plot(filename)


def main():
    attempt_csv = find_latest_file("adaptive-eval-attempts-*.csv")
    session_csv = find_latest_file("adaptive-eval-sessions-*.csv")

    print(f"Using attempt CSV: {attempt_csv}")
    print(f"Using session CSV: {session_csv}")

    attempt_df = pd.read_csv(attempt_csv)
    session_df = pd.read_csv(session_csv)

    # Ensure numeric columns are numeric
    attempt_numeric_cols = ["attempt", "difficulty", "probabilityCorrect", "oldMastery", "newMastery", "delta"]
    for col in attempt_numeric_cols:
        if col in attempt_df.columns:
            attempt_df[col] = pd.to_numeric(attempt_df[col], errors="coerce")

    session_numeric_cols = [
        "questionsAnswered",
        "numCorrect",
        "accuracy",
        "startingMastery",
        "endingMastery",
        "masteryGain",
        "avgDifficulty",
    ]
    for col in session_numeric_cols:
        if col in session_df.columns:
            session_df[col] = pd.to_numeric(session_df[col], errors="coerce")

    plot_mastery_over_attempts(attempt_df)
    plot_difficulty_over_attempts(attempt_df)

    plot_session_metric_bars(
        session_df,
        metric="masteryGain",
        ylabel="Mastery Gain",
        filename="session_mastery_gain.png",
    )

    plot_session_metric_bars(
        session_df,
        metric="accuracy",
        ylabel="Accuracy",
        filename="session_accuracy.png",
    )

    plot_session_metric_bars(
        session_df,
        metric="avgDifficulty",
        ylabel="Average Difficulty",
        filename="session_avg_difficulty.png",
    )

    print("\nAll plots generated successfully.")


if __name__ == "__main__":
    main()