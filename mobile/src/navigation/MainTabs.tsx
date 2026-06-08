import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import HomeScreen from "../screens/home/HomeScreen";
import TransactionsScreen from "../screens/transactions/TransactionsScreen";
import BudgetScreen from "../screens/budget/BudgetScreen";
import InsightsScreen from "../screens/insights/InsightsScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator();

const TABS = [
  { name: "Home", component: HomeScreen, icon: "home" },
  { name: "Transactions", component: TransactionsScreen, icon: "list" },
  { name: "Budgets", component: BudgetScreen, icon: "pie-chart" },
  { name: "Insight", component: InsightsScreen, icon: "bulb" },
  { name: "Profile", component: ProfileScreen, icon: "person" },
];

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 90,
          paddingBottom: 8,
        },
        tabBarIcon: ({ color, size }) => {
          const tab = TABS.find((t) => t.name === route.name);
          return <Ionicons name={tab?.icon as any} size={size} color={color} />;
        },
      })}
    >
      {TABS.map((tab) => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
}
