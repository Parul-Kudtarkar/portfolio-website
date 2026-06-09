const references = [
  "Vinagre J, et al. Frequency of TERT promoter mutations in human cancers. Nat Commun. 2013;4:2185.",
  "Nault JC, et al. High frequency of telomerase reverse-transcriptase promoter somatic mutations in hepatocellular carcinoma and preneoplastic lesions. Nat Commun. 2013;4:2218.",
  "Horn S, et al. TERT promoter mutations in familial and sporadic melanoma. Science. 2013;339(6122):959–961.",
  "Huang FW, et al. Highly recurrent TERT promoter mutations in human melanoma. Science. 2013;339(6122):957–959.",
  "Killela PJ, et al. TERT promoter mutations occur frequently in gliomas and a subset of tumors derived from cells with low rates of self-renewal. Proc Natl Acad Sci USA. 2013;110(15):6021–6026.",
  "Blackburn EH. Telomere states and cell fates. Nature. 2000;408(6808):53–56.",
  "Hayflick L, Moorhead PS. The serial cultivation of human diploid cell strains. Exp Cell Res. 1961;25:585–621.",
  "Campisi J. Senescent cells, tumor suppression and organismal aging: good citizens, bad neighbors. Cell. 2005;120(4):513–522.",
  "Greider CW, Blackburn EH. Identification of a specific telomere terminal transferase activity in Tetrahymena extracts. Cell. 1985;43(2):405–413.",
  "Nakamura TM, et al. Telomerase catalytic subunit homologs from fission yeast and human. Science. 1997;277(5328):955–959.",
  "Shay JW, Wright WE. Telomeres and telomerase: three decades of progress. Nat Rev Genet. 2019;20(5):299–309.",
  "Akincilar SC, Unal B, Tergaonkar V. Reactivation of telomerase in cancer. Cell Mol Life Sci. 2016;73(8):1659–1670.",
  "Bell RJ, et al. The transcription factor GABP selectively binds and activates the mutant TERT promoter in cancer. Science. 2015;348(6238):1036–1039.",
  "Bell RJ, et al. The transcription factor GABPA is required for nuclear reprogramming and maintenance of the TERT promoter in melanoma. Mol Cell. 2015;57(5):807–818.",
  "Stern JL, et al. Mutation of the TERT promoter, switch to active chromatin and monoallelic TERT expression in multiple cancers. Genes Dev. 2015;29(21):2219–2224.",
  "Avsec Ž, et al. Advancing regulatory variant effect prediction with AlphaGenome. Nature. 2026. Published 28 January 2026.",
  "Karczewski KJ, et al. The mutational constraint spectrum quantified from variation in 141,456 humans. Nature. 2020;581(7809):434–443.",
  "Clapier CR, Cairns BR. The biology of chromatin remodeling complexes. Annu Rev Biochem. 2009;78:273–304.",
  "Heintzman ND, et al. Distinct and predictive chromatin signatures of transcriptional promoters and enhancers in the human genome. Nat Genet. 2007;39(3):311–318.",
  "Platzbecker U, et al. Imetelstat in patients with lower-risk myelodysplastic syndromes who have relapsed or are refractory to erythropoiesis-stimulating agents. J Clin Oncol. 2024;42(9):1010–1019.",
  "Tefferi A, et al. Imetelstat, a telomerase inhibitor, in myelofibrosis. N Engl J Med. 2024;390(11):994–1005.",
  "Ochoa D, et al. The next-generation Open Targets Platform: reimagining target-disease associations. Nucleic Acids Res. 2023;51(D1):D1353–D1359.",
  "Hu J, et al. Antitelomerase therapy provokes ALT and mitochondrial adaptive mechanisms in cancer. Cell. 2012;148(4):651–663.",
  "Bushweller JH. Targeting transcription factors in cancer — from undruggable to reality. Nat Rev Cancer. 2019;19(11):611–624.",
  "Békés M, Langley DR, Crews CM. PROTAC targeted protein degraders: the past is prologue. Nat Rev Drug Discov. 2022;21(3):181–200.",
  "Nassiri F, et al. Detection and discrimination of intracranial tumors using plasma cell-free DNA methylomes. Nat Med. 2020;26(7):1044–1047.",
  "Nassiri F, et al. Detection and discrimination of intracranial tumors using plasma cell-free DNA methylomes. Nat Med. 2023;29(4):930–939.",
]

export default function ReferenceList() {
  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-xl font-bold mb-4">References</h2>
      <ol className="space-y-2">
        {references.map((ref, i) => (
          <li key={i} id={`ref-${i + 1}`} className="flex gap-2 text-sm text-gray-700">
            <span className="font-medium shrink-0">{i + 1}.</span>
            <span>
              {ref}{" "}
              <a href={`#cite-${i + 1}`} className="text-blue-400 hover:text-blue-600 text-xs ml-1">
                ↩
              </a>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

