from main import greedy_max_coverage

def run_toy_test():
    print("Toy Example Test")

    # Toy example stations (lists are converted to sets automatically inside main)
    stations = {
        "S1": {1, 2},
        "S2": {2, 3, 4},
        "S3": {5}
    }

    k = 2

    print(f"Input k = {k}")
    print("Stations:")
    for name, regions in stations.items():
        print(f"  {name} → {sorted(list(regions))}")

    # Run algorithm
    chosen, covered = greedy_max_coverage(k, stations)

    print("\nAlgorithm Output:")
    print(f"Chosen Stations: {chosen}")
    print(f"Covered Regions: {sorted(covered)}")

    print("\nExpected Behavior:")
    print("- S2 should be picked first (covers 3 new regions)")
    print("- Second choice should be S1 or S3 (both add 1 new region)")
    print("- Total covered regions should be {1,2,3,4}")

    print("\nTest Complete")


if __name__ == "__main__":
    run_toy_test()