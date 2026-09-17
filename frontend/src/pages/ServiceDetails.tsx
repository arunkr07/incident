import { ArrowLeft, BrainCircuit } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import DependencyMap from "../components/services/DependencyMap";
import ServiceHealth from "../components/services/ServiceHealth";
import ServiceMetrics from "../components/services/ServiceMetrics";
import { dependencies, services } from "../data/operationsData";

export default function ServiceDetails() {
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const service = services.find(
    (item) => item.id === serviceId,
  );

  if (!service) {
    return (
      <div className="py-20 text-center">
        <p className="text-white">Service not found.</p>
      </div>
    );
  }

  const serviceDependencies = dependencies.filter(
    (dependency) =>
      dependency.source === service.id ||
      dependency.target === service.id,
  );

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/services")}
        className="flex items-center gap-2 text-sm text-white/40 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to services
      </button>

      <section className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-mono text-xl font-semibold text-white">
                {service.name}
              </h1>

              <ServiceHealth status={service.status} />
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
              {service.description}
            </p>
          </div>

          <button
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 text-xs font-medium text-emerald-300 hover:bg-emerald-500/15"
          >
            <BrainCircuit size={15} />
            Investigate service
          </button>
        </div>

        <div className="mt-7">
          <ServiceMetrics service={service} />
        </div>
      </section>

      <DependencyMap dependencies={serviceDependencies} />
    </div>
  );
}