import Image from "next/image";
import { Linkedin, Mail, Twitter } from "lucide-react";
import { prisma } from "@/lib/prisma";

export async function LeadershipTeam() {
  const teamMembers = await prisma.teamMember.findMany({
    where: {
      isActive: true,
    },
    orderBy: [
      { displayOrder: "asc" },
      { createdAt: "asc" },
    ],
    select: {
      id: true,
      name: true,
      role: true,
      department: true,
      image: true,
      bio: true,
      linkedinUrl: true,
      email: true,
    },
  });
  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
            Meet our team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These people work on making our product best.
          </p>
        </div>

        {teamMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No team members available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => {
              // const isHighlighted = index % 3 === 1; // Every second card (middle one in groups of 3)
              return (
                <div
                  key={member.id}
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl bg-card border border-border`}
                >
                  {/* Image */}
                  <div className="relative h-80 w-full overflow-hidden rounded-t-2xl">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center bg-primary/20"
                      >
                        <span
                          className="text-6xl font-semibold text-primary-foreground"
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3
                          className="text-xl font-bold mb-1 text-foreground"
                        >
                          {member.name}
                        </h3>
                        <p
                          className="text-sm font-medium text-muted-foreground"
                        >
                          {member.role} - {member.department}
                        </p>
                      </div>

                      {/* Social Links */}
                      <div className="flex items-center gap-2 shrink-0">
                        {member.linkedinUrl && (
                          <a
                            href={member.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors bg-primary/10 hover:bg-primary/20 text-primary"
                            aria-label="LinkedIn"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        )}
                        {/* {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors bg-primary/10 hover:bg-primary/20 text-primary"
                            aria-label="Email"
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                        )} */}
                      </div>
                    </div>
                    <p
                          className="text-sm text-muted-foreground"
                        >
                          {member.bio}
                        </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

