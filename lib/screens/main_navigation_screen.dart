import 'package:flutter/material.dart';

import 'home_screen.dart';
import 'history_screen.dart';
import 'profile_screen.dart';

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() =>
      _MainNavigationScreenState();
}

class _MainNavigationScreenState
    extends State<MainNavigationScreen> {

  int currentIndex = 0;

  final List<Widget> pages = const [
    HomeScreen(),
    HistoryScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(

      body: pages[currentIndex],

      bottomNavigationBar: Container(
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(25),
          boxShadow: const [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 10,
              offset: Offset(0, 4),
            ),
          ],
        ),
        
        child: ClipRRect(
          borderRadius: BorderRadius.circular(25),
          
          child: BottomNavigationBar(
            currentIndex: currentIndex,
            onTap: (index) {
              setState(() {
                currentIndex = index;
                });
            },

        backgroundColor: Colors.white,
        elevation: 0,
        type: BottomNavigationBarType.fixed,

        selectedItemColor: Colors.green,
        unselectedItemColor: Colors.grey,

        items: const [
          BottomNavigationBarItem(
           icon: Icon(Icons.home_rounded),
           label: "Home",
          ),
          BottomNavigationBarItem(
           icon: Icon(Icons.history_rounded),
           label: "History",
          ),
          BottomNavigationBarItem(
           icon: Icon(Icons.person_rounded),
           label: "Profile",
          ),
       ],
    ),
  ),
),
    );
  }
}