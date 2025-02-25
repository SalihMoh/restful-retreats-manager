
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Hotel, Star, Shield, Clock, Award, Users, Heart } from "lucide-react";

const AboutPage = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Sophie Martin",
      role: "Fondatrice & CEO",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      bio: "Passionnée par l'hospitalité de luxe avec plus de 15 ans d'expérience dans le secteur hôtelier."
    },
    {
      name: "Thomas Dubois",
      role: "Directeur Technique",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      bio: "Expert en technologies avec une vision innovante pour transformer l'expérience de réservation d'hôtels."
    },
    {
      name: "Emma Laurent",
      role: "Responsable Relation Client",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&