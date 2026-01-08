"use client";

import Image from "next/image";
import Link from "next/link";

import { OpeningHoursFooter } from "@/components/OpeningHoursFooter";
import { Container } from "@/components/Container";

import { useConfigStore } from "@/store/configStore";
import { useEffect } from "react";
import { getDiaSemana } from "@/utils/getDiaSemana";
import { DetailTitle } from "./DetailTitle";
import ContactSection from "./ContactSection";
import { SkeletonComponent } from "./SkeletonComponent";

export const Footer = () => {
  const {
    fetchOpeningHours,
    openingHours: horarios,
    fetchSettings,
    settings,
  } = useConfigStore();

  useEffect(() => {
    fetchOpeningHours();
    fetchSettings();
  }, [fetchOpeningHours, fetchSettings]);

  const isLoadingOpeningHours = !horarios.length;
  const isLoadingSettings = !settings;

  return (
    <Container styleRow="bg-green-principal-500 text-white">
      {isLoadingOpeningHours || isLoadingSettings ? (
        <FooterSkeleton />
      ) : (
        <footer className="pt-12 pb-3 gap-5 flex flex-col justify-between">
          <div className="grid md:grid-cols-3 md:py-5 gap-10">
            <div>
              <Link href={"/"}>
                <Image
                  src={"/logo-footer.svg"}
                  alt="Logo do Restaurante Spumoni"
                  width={300}
                  height={60}
                />
              </Link>
              <p className="mt-4">{settings?.mensagem_rodape}</p>
            </div>

            <section>
              <div className="flex items-center gap-2">
                <DetailTitle />
                <h2 className="font-bold text-lg">Horários de Funcionamento</h2>
              </div>
              <div className="py-2">
                {horarios?.map((item) => (
                  <OpeningHoursFooter key={item.id}>
                    {getDiaSemana(item.dia_semana)}: {item.horario_abertura} às{" "}
                    {item.horario_fechamento}
                    {item.observacao && (
                      <>
                        <br />
                        <span className="text-sm">({item.observacao})</span>
                      </>
                    )}
                  </OpeningHoursFooter>
                ))}
              </div>
            </section>

            <ContactSection />
          </div>

          <section className="flex flex-col md:flex-row gap-3 justify-between">
            <p>
              Restaurante & Sorveteria Spumoni 2025. Todos os direitos
              reservados.
            </p>
            <p>
              Desenvolvido por{" "}
              <Link href={"http://www.lordsystem.com.br/"} target="_blank">
                Lord System
              </Link>
              .
            </p>
          </section>
        </footer>
      )}
    </Container>
  );
};

const FooterSkeleton = () => {
  return (
    <Container styleRow="bg-green-principal-500 text-white">
      <footer className="pt-12 pb-3 gap-5 flex flex-col justify-between">
        <div className="grid md:grid-cols-3 md:py-5 gap-10 justify-between w">
          <div className="flex flex-col gap-4">
            <SkeletonComponent height={60} width={"80%"} />
            <SkeletonComponent height={100} width={"100%"} />
          </div>

          <section>
            <div className="flex items-center mb-3">
              <SkeletonComponent height={24} width={300} />
            </div>
            <div className="py-2 flex flex-col gap-2">
              <SkeletonComponent height={24} width={"100%"} />
              <SkeletonComponent height={24} width={"100%"} />
              <SkeletonComponent height={24} width={"100%"} />
              <SkeletonComponent height={24} width={"100%"} />
              <SkeletonComponent height={24} width={"100%"} />
              <SkeletonComponent height={24} width={"100%"} />
            </div>
          </section>

          <div className="flex flex-col gap-2">
            <SkeletonComponent height={24} width={"80%"} />
            <SkeletonComponent height={24} width={"100%"} />
            <div className="flex gap-2">
              <SkeletonComponent height={24} width={24} borderRadius={999} />
              <SkeletonComponent height={24} width={24} borderRadius={999} />
              <SkeletonComponent height={24} width={24} borderRadius={999} />
            </div>
          </div>
        </div>

        <section className="flex flex-col md:flex-row gap-3 justify-between">
          <SkeletonComponent height={24} width={400} />
          <SkeletonComponent height={24} width={200} />
        </section>
      </footer>
    </Container>
  );
};
