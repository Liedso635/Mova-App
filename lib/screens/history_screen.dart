import 'package:flutter/material.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  final List<Map<String, String>> rides = const [
    {
      "from": "Home",
      "to": "University",
      "date": "10 Jun 2026",
      "price": "250 MZN",
      "status": "Completed",
    },
    {
      "from": "Matola",
      "to": "Shoprite",
      "date": "08 Jun 2026",
      "price": "120 MZN",
      "status": "Completed",
    },
    {
      "from": "Home",
      "to": "Airport",
      "date": "05 Jun 2026",
      "price": "600 MZN",
      "status": "Completed",
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FB),

      body: Expanded(
  child: ListView.builder(
    itemCount: rides.length,
    itemBuilder: (context, index) {
      final ride = rides[index];

      return Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [

            Text(
              "${ride["from"]} → ${ride["to"]}",
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 5),

            Text(ride["date"]!),

            const SizedBox(height: 5),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  ride["price"]!,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),

                const Text(
                  "Completed",
                  style: TextStyle(
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
          ],
        ),
      );
    },
  ),
),
    );
  }
}