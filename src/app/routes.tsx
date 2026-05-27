import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Discover } from "./components/Discover";
import { MyTickets } from "./components/MyTickets";
import { Events } from "./components/Events";
import { Profile } from "./components/Profile";
import { EventDetail } from "./components/EventDetail";
import { RoutePlanner } from "./components/RoutePlanner";
import { TicketSelection } from "./components/TicketSelection";
import { Cart } from "./components/Cart";
import { RouteCheckout } from "./components/RouteCheckout";
import { ResaleMarket } from "./components/ResaleMarket";
import { ResaleEventDetail } from "./components/ResaleEventDetail";
import { UserProfile } from "./components/UserProfile";
import { ArtistDetail } from "./components/ArtistDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Discover },
      { path: "tickets", Component: MyTickets },
      { path: "events", Component: Events },
      { path: "resale", Component: ResaleMarket },
      { path: "resale/event/:eventId", Component: ResaleEventDetail },
      { path: "user/:username", Component: UserProfile },
      { path: "profile", Component: Profile },
      { path: "event/:id", Component: EventDetail },
      { path: "event/:id/tickets", Component: TicketSelection },
      { path: "artist/:id", Component: ArtistDetail },
      { path: "cart", Component: Cart },
      { path: "route-planner", Component: RoutePlanner },
      { path: "route-checkout", Component: RouteCheckout },
    ],
  },
]);
