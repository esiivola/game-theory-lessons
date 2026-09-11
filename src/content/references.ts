// Shared bibliography, keyed by cite key. Lesson `refs` render from here so nothing is
// entered twice. Extend as lessons are authored. Style: author, year, title (italic for books),
// venue. No em dashes.

export const REFERENCES: Record<string, string> = {
  osborne2004:
    'Osborne, M. J. (2004). <i>An Introduction to Game Theory</i>. Oxford University Press.',
  osborneRubinstein1994:
    'Osborne, M. J., and Rubinstein, A. (1994). <i>A Course in Game Theory</i>. MIT Press.',
  gibbons1992:
    'Gibbons, R. (1992). <i>Game Theory for Applied Economists</i>. Princeton University Press.',
  vonNeumannMorgenstern1944:
    'von Neumann, J., and Morgenstern, O. (1944). <i>Theory of Games and Economic Behavior</i>. Princeton University Press.',
  nash1950:
    'Nash, J. F. (1950). Equilibrium points in n-person games. <i>PNAS</i>, 36(1), 48-49.',
  nash1950bargaining:
    'Nash, J. F. (1950). The bargaining problem. <i>Econometrica</i>, 18(2), 155-162.',
  vonNeumann1928:
    'von Neumann, J. (1928). Zur Theorie der Gesellschaftsspiele. <i>Mathematische Annalen</i>, 100, 295-320.',
  rapoportGuyer1966:
    'Rapoport, A., and Guyer, M. (1966). A taxonomy of 2x2 games. <i>General Systems</i>, 11, 203-214.',
  bernheim1984:
    'Bernheim, B. D. (1984). Rationalizable strategic behavior. <i>Econometrica</i>, 52(4), 1007-1028.',
  pearce1984:
    'Pearce, D. G. (1984). Rationalizable strategic behavior and the problem of perfection. <i>Econometrica</i>, 52(4), 1029-1050.',
  axelrod1984:
    'Axelrod, R. (1984). <i>The Evolution of Cooperation</i>. Basic Books.',
  flood1958:
    'Flood, M. M. (1958). Some experimental games. <i>Management Science</i>, 5(1), 5-26.',
  hardin1968:
    'Hardin, G. (1968). The tragedy of the commons. <i>Science</i>, 162, 1243-1248.',
  schelling1960:
    'Schelling, T. C. (1960). <i>The Strategy of Conflict</i>. Harvard University Press.',
  walkerWooders2001:
    'Walker, M., and Wooders, J. (2001). Minimax play at Wimbledon. <i>American Economic Review</i>, 91(5), 1521-1538.',
  palaciosHuerta2003:
    'Palacios-Huerta, I. (2003). Professionals play minimax. <i>Review of Economic Studies</i>, 70(2), 395-415.',
  nagel1995:
    'Nagel, R. (1995). Unraveling in guessing games: an experimental study. <i>American Economic Review</i>, 85(5), 1313-1326.',
  mehta1994:
    'Mehta, J., Starmer, C., and Sugden, R. (1994). The nature of salience: an experimental investigation of pure coordination games. <i>American Economic Review</i>, 84(3), 658-673.',
  cournot1838:
    'Cournot, A. A. (1838). <i>Recherches sur les principes mathematiques de la theorie des richesses</i>. Hachette.',
  bertrand1883:
    'Bertrand, J. (1883). Review of "Theorie mathematique de la richesse sociale". <i>Journal des Savants</i>, 67, 499-508.',
  ledyard1995:
    'Ledyard, J. O. (1995). Public goods: a survey of experimental research. In Kagel, J. and Roth, A. (eds.), <i>The Handbook of Experimental Economics</i>. Princeton University Press.',
  selten1965:
    'Selten, R. (1965). Spieltheoretische Behandlung eines Oligopolmodells mit Nachfragetragheit. <i>Zeitschrift fur die gesamte Staatswissenschaft</i>, 121, 301-324.',
  rosenthal1981:
    'Rosenthal, R. W. (1981). Games of perfect information, predatory pricing and the chain-store paradox. <i>Journal of Economic Theory</i>, 25(1), 92-100.',
  selten1975:
    'Selten, R. (1975). Reexamination of the perfectness concept for equilibrium points in extensive games. <i>International Journal of Game Theory</i>, 4(1), 25-55.',
  stackelberg1934:
    'von Stackelberg, H. (1934). <i>Marktform und Gleichgewicht</i>. Springer.',
  friedman1971:
    'Friedman, J. W. (1971). A non-cooperative equilibrium for supergames. <i>Review of Economic Studies</i>, 38(1), 1-12.',
  chiappori2002:
    'Chiappori, P.-A., Levitt, S., and Groseclose, T. (2002). Testing mixed-strategy equilibria when players are heterogeneous: the case of penalty kicks in soccer. <i>American Economic Review</i>, 92(4), 1138-1151.',
  aumann1974:
    'Aumann, R. J. (1974). Subjectivity and correlation in randomized strategies. <i>Journal of Mathematical Economics</i>, 1(1), 67-96.',
  vanHuyck1990:
    'Van Huyck, J. B., Battalio, R. C., and Beil, R. O. (1990). Tacit coordination games, strategic uncertainty, and coordination failure. <i>American Economic Review</i>, 80(1), 234-248.',
  milgromRoberts1990:
    'Milgrom, P., and Roberts, J. (1990). Rationalizability, learning, and equilibrium in games with strategic complementarities. <i>Econometrica</i>, 58(6), 1255-1277.',
  rubinstein1982:
    'Rubinstein, A. (1982). Perfect equilibrium in a bargaining model. <i>Econometrica</i>, 50(1), 97-109.',
  fudenbergMaskin1986:
    'Fudenberg, D., and Maskin, E. (1986). The folk theorem in repeated games with discounting or with incomplete information. <i>Econometrica</i>, 54(3), 533-554.',
  greenPorter1984:
    'Green, E. J., and Porter, R. H. (1984). Noncooperative collusion under imperfect price information. <i>Econometrica</i>, 52(1), 87-100.',
  abreuPearceStacchetti1990:
    'Abreu, D., Pearce, D., and Stacchetti, E. (1990). Toward a theory of discounted repeated games with imperfect monitoring. <i>Econometrica</i>, 58(5), 1041-1063.',
  krepsWilson1982:
    'Kreps, D. M., and Wilson, R. (1982). Reputation and imperfect information. <i>Journal of Economic Theory</i>, 27(2), 253-279.',
  milgromRoberts1982:
    'Milgrom, P., and Roberts, J. (1982). Predation, reputation, and entry deterrence. <i>Journal of Economic Theory</i>, 27(2), 280-312.',
  harsanyi1967:
    'Harsanyi, J. C. (1967-68). Games with incomplete information played by Bayesian players, parts I-III. <i>Management Science</i>, 14(3, 5, 7).',
  vickrey1961:
    'Vickrey, W. (1961). Counterspeculation, auctions, and competitive sealed tenders. <i>Journal of Finance</i>, 16(1), 8-37.',
  wilson1969:
    'Wilson, R. (1969). Competitive bidding with disparate information. <i>Management Science</i>, 15(7), 446-448.',
  milgromWeber1982:
    'Milgrom, P. R., and Weber, R. J. (1982). A theory of auctions and competitive bidding. <i>Econometrica</i>, 50(5), 1089-1122.',
  fudenbergTirole1991:
    'Fudenberg, D., and Tirole, J. (1991). Perfect Bayesian equilibrium and sequential equilibrium. <i>Journal of Economic Theory</i>, 53(2), 236-260.',
  spence1973:
    'Spence, M. (1973). Job market signaling. <i>Quarterly Journal of Economics</i>, 87(3), 355-374.',
  choKreps1987:
    'Cho, I.-K., and Kreps, D. M. (1987). Signaling games and stable equilibria. <i>Quarterly Journal of Economics</i>, 102(2), 179-221.',
  akerlof1970:
    'Akerlof, G. A. (1970). The market for "lemons": quality uncertainty and the market mechanism. <i>Quarterly Journal of Economics</i>, 84(3), 488-500.',
  rothschildStiglitz1976:
    'Rothschild, M., and Stiglitz, J. (1976). Equilibrium in competitive insurance markets. <i>Quarterly Journal of Economics</i>, 90(4), 629-649.',
  crawfordSobel1982:
    'Crawford, V. P., and Sobel, J. (1982). Strategic information transmission. <i>Econometrica</i>, 50(6), 1431-1451.',
  kamenicaGentzkow2011:
    'Kamenica, E., and Gentzkow, M. (2011). Bayesian persuasion. <i>American Economic Review</i>, 101(6), 2590-2615.',
  holmstrom1979:
    'Holmström, B. (1979). Moral hazard and observability. <i>Bell Journal of Economics</i>, 10(1), 74-91.',
  grossmanHart1983:
    'Grossman, S. J., and Hart, O. D. (1983). An analysis of the principal-agent problem. <i>Econometrica</i>, 51(1), 7-45.',
  aumann1976:
    'Aumann, R. J. (1976). Agreeing to disagree. <i>Annals of Statistics</i>, 4(6), 1236-1239.',
  milgromStokey1982:
    'Milgrom, P., and Stokey, N. (1982). Information, trade and common knowledge. <i>Journal of Economic Theory</i>, 26(1), 17-27.',
  rubinstein1989:
    'Rubinstein, A. (1989). The electronic mail game: strategic behavior under almost common knowledge. <i>American Economic Review</i>, 79(3), 385-391.',
  carlssonVanDamme1993:
    'Carlsson, H., and van Damme, E. (1993). Global games and equilibrium selection. <i>Econometrica</i>, 61(5), 989-1018.',
  morrisShin1998:
    'Morris, S., and Shin, H. S. (1998). Unique equilibrium in a model of self-fulfilling currency attacks. <i>American Economic Review</i>, 88(3), 587-597.',
  arrow1951:
    'Arrow, K. J. (1951). <i>Social Choice and Individual Values</i>. Wiley.',
  gibbard1973:
    'Gibbard, A. (1973). Manipulation of voting schemes: a general result. <i>Econometrica</i>, 41(4), 587-601.',
  satterthwaite1975:
    'Satterthwaite, M. A. (1975). Strategy-proofness and Arrow\'s conditions. <i>Journal of Economic Theory</i>, 10(2), 187-217.',
  myerson1979:
    'Myerson, R. B. (1979). Incentive compatibility and the bargaining problem. <i>Econometrica</i>, 47(1), 61-73.',
  clarke1971:
    'Clarke, E. H. (1971). Multipart pricing of public goods. <i>Public Choice</i>, 11, 17-33.',
  groves1973:
    'Groves, T. (1973). Incentives in teams. <i>Econometrica</i>, 41(4), 617-631.',
  myerson1981:
    'Myerson, R. B. (1981). Optimal auction design. <i>Mathematics of Operations Research</i>, 6(1), 58-73.',
  myersonSatterthwaite1983:
    'Myerson, R. B., and Satterthwaite, M. A. (1983). Efficient mechanisms for bilateral trading. <i>Journal of Economic Theory</i>, 29(2), 265-281.',
  maskin1999:
    'Maskin, E. (1999). Nash equilibrium and welfare optimality. <i>Review of Economic Studies</i>, 66(1), 23-38.',
  edelmanOstrovskySchwarz2007:
    'Edelman, B., Ostrovsky, M., and Schwarz, M. (2007). Internet advertising and the generalized second-price auction. <i>American Economic Review</i>, 97(1), 242-259.',
  ausubelMilgrom2004:
    'Ausubel, L. M., and Milgrom, P. (2004). Ascending auctions with package bidding. <i>Frontiers of Theoretical Economics</i>, 1(1).',
  gillies1959:
    'Gillies, D. B. (1959). Solutions to general non-zero-sum games. In <i>Contributions to the Theory of Games IV</i>. Princeton University Press.',
  shapley1953:
    'Shapley, L. S. (1953). A value for n-person games. In <i>Contributions to the Theory of Games II</i>. Princeton University Press.',
  schmeidler1969:
    'Schmeidler, D. (1969). The nucleolus of a characteristic function game. <i>SIAM Journal on Applied Mathematics</i>, 17(6), 1163-1170.',
  aumannMaschler1985:
    'Aumann, R. J., and Maschler, M. (1985). Game theoretic analysis of a bankruptcy problem from the Talmud. <i>Journal of Economic Theory</i>, 36(2), 195-213.',
  galeShapley1962:
    'Gale, D., and Shapley, L. S. (1962). College admissions and the stability of marriage. <i>American Mathematical Monthly</i>, 69(1), 9-15.',
  shapleyScarf1974:
    'Shapley, L., and Scarf, H. (1974). On cores and indivisibility. <i>Journal of Mathematical Economics</i>, 1(1), 23-37.',
  rothSonmezUnver2004:
    'Roth, A. E., Sönmez, T., and Ünver, M. U. (2004). Kidney exchange. <i>Quarterly Journal of Economics</i>, 119(2), 457-488.',
  hatfieldMilgrom2005:
    'Hatfield, J. W., and Milgrom, P. R. (2005). Matching with contracts. <i>American Economic Review</i>, 95(4), 913-935.',
  abdulkadirogluSonmez2003:
    'Abdulkadiroğlu, A., and Sönmez, T. (2003). School choice: a mechanism design approach. <i>American Economic Review</i>, 93(3), 729-747.',
  maynardSmithPrice1973:
    'Maynard Smith, J., and Price, G. R. (1973). The logic of animal conflict. <i>Nature</i>, 246, 15-18.',
  taylorJonker1978:
    'Taylor, P. D., and Jonker, L. B. (1978). Evolutionarily stable strategies and game dynamics. <i>Mathematical Biosciences</i>, 40(1-2), 145-156.',
  kandoriMailathRob1993:
    'Kandori, M., Mailath, G. J., and Rob, R. (1993). Learning, mutation, and long run equilibria in games. <i>Econometrica</i>, 61(1), 29-56.',
  young1993:
    'Young, H. P. (1993). The evolution of conventions. <i>Econometrica</i>, 61(1), 57-84.',
  brown1951:
    'Brown, G. W. (1951). Iterative solution of games by fictitious play. In <i>Activity Analysis of Production and Allocation</i>. Wiley.',
  hartMasColell2000:
    'Hart, S., and Mas-Colell, A. (2000). A simple adaptive procedure leading to correlated equilibrium. <i>Econometrica</i>, 68(5), 1127-1150.',
  daskalakis2009:
    'Daskalakis, C., Goldberg, P. W., and Papadimitriou, C. H. (2009). The complexity of computing a Nash equilibrium. <i>SIAM Journal on Computing</i>, 39(1), 195-259.',
  rosenthal1973:
    'Rosenthal, R. W. (1973). A class of games possessing pure-strategy Nash equilibria. <i>International Journal of Game Theory</i>, 2(1), 65-67.',
  mondererShapley1996:
    'Monderer, D., and Shapley, L. S. (1996). Potential games. <i>Games and Economic Behavior</i>, 14(1), 124-143.',
  roughgardenTardos2002:
    'Roughgarden, T., and Tardos, E. (2002). How bad is selfish routing? <i>Journal of the ACM</i>, 49(2), 236-259.',
  braess1968:
    'Braess, D. (1968). Uber ein Paradoxon aus der Verkehrsplanung. <i>Unternehmensforschung</i>, 12, 258-268.',
  kearnsLittmanSingh2001:
    'Kearns, M., Littman, M. L., and Singh, S. (2001). Graphical models for game theory. <i>Proceedings of UAI</i>, 253-260.',
  camererHoChong2004:
    'Camerer, C. F., Ho, T.-H., and Chong, J.-K. (2004). A cognitive hierarchy model of games. <i>Quarterly Journal of Economics</i>, 119(3), 861-898.',
  mckelveyPalfrey1995:
    'McKelvey, R. D., and Palfrey, T. R. (1995). Quantal response equilibria for normal form games. <i>Games and Economic Behavior</i>, 10(1), 6-38.',
  guth1982:
    'Güth, W., Schmittberger, R., and Schwarze, B. (1982). An experimental analysis of ultimatum bargaining. <i>Journal of Economic Behavior and Organization</i>, 3(4), 367-388.',
  fehrSchmidt1999:
    'Fehr, E., and Schmidt, K. M. (1999). A theory of fairness, competition, and cooperation. <i>Quarterly Journal of Economics</i>, 114(3), 817-868.',
  berg1995:
    'Berg, J., Dickhaut, J., and McCabe, K. (1995). Trust, reciprocity, and social history. <i>Games and Economic Behavior</i>, 10(1), 122-142.',
  rabin1993:
    'Rabin, M. (1993). Incorporating fairness into game theory and economics. <i>American Economic Review</i>, 83(5), 1281-1302.',
  charnessRabin2002:
    'Charness, G., and Rabin, M. (2002). Understanding social preferences with simple tests. <i>Quarterly Journal of Economics</i>, 117(3), 817-869.',
  blount1995:
    'Blount, S. (1995). When social outcomes are not fair: the effect of causal attributions on preferences. <i>Organizational Behavior and Human Decision Processes</i>, 63(2), 131-144.',
  fehrGachter2000:
    'Fehr, E., and Gächter, S. (2000). Cooperation and punishment in public goods experiments. <i>American Economic Review</i>, 90(4), 980-994.',
  camererHo1999:
    'Camerer, C., and Ho, T.-H. (1999). Experience-weighted attraction learning in normal form games. <i>Econometrica</i>, 67(4), 827-874.',
  mckelveyPalfrey1992:
    'McKelvey, R. D., and Palfrey, T. R. (1992). An experimental study of the centipede game. <i>Econometrica</i>, 60(4), 803-836.',
  henrich2001:
    'Henrich, J., et al. (2001). In search of Homo economicus: behavioral experiments in 15 small-scale societies. <i>American Economic Review</i>, 91(2), 73-78.',
  roth2015:
    'Roth, A. E. (2015). <i>Who Gets What and Why</i>. Houghton Mifflin Harcourt.',
  milgrom2004:
    'Milgrom, P. (2004). <i>Putting Auction Theory to Work</i>. Cambridge University Press.',
  schelling1966:
    'Schelling, T. C. (1966). <i>Arms and Influence</i>. Yale University Press.',
  dixit1980:
    'Dixit, A. (1980). The role of investment in entry-deterrence. <i>Economic Journal</i>, 90(357), 95-106.',
  brandenburgerNalebuff1996:
    'Brandenburger, A. M., and Nalebuff, B. J. (1996). <i>Co-opetition</i>. Doubleday.',
  rochetTirole2003:
    'Rochet, J.-C., and Tirole, J. (2003). Platform competition in two-sided markets. <i>Journal of the European Economic Association</i>, 1(4), 990-1029.',
  ostrom1990:
    'Ostrom, E. (1990). <i>Governing the Commons</i>. Cambridge University Press.',
  downs1957:
    'Downs, A. (1957). <i>An Economic Theory of Democracy</i>. Harper and Row.',
  bayeKovenockDeVries1993:
    'Baye, M. R., Kovenock, D., and de Vries, C. G. (1993). Rigging the lobbying process: an application of the all-pay auction. <i>American Economic Review</i>, 83(1), 289-294.',
  shavell2004:
    'Shavell, S. (2004). <i>Foundations of Economic Analysis of Law</i>. Harvard University Press.',
  tambe2011:
    'Tambe, M. (2011). <i>Security and Game Theory: Algorithms, Deployed Systems, Lessons Learned</i>. Cambridge University Press.',
};

/** Resolve a list of cite keys to citation strings, dropping unknown keys. */
export function resolveRefs(keys: string[] = []): string[] {
  return keys.map((k) => REFERENCES[k]).filter((v): v is string => Boolean(v));
}
